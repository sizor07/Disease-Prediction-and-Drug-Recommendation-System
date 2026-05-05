"""
Management command to load medical data from CSV file into database.

Usage:
    python manage.py load_medical_data [--csv_path path/to/file.csv] [--clear]

Options:
    --csv_path: Path to CSV file (default: symptom-disease-drug.csv)
    --clear: Clear existing data before loading
"""

import os
import csv
import pandas as pd
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from core.models import Medical, User


class Command(BaseCommand):
    help = 'Load medical data from CSV file into the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--csv_path',
            type=str,
            default='symptom-disease-drug.csv',
            help='Path to the CSV file to load'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing Medical records before loading'
        )

    @transaction.atomic
    def handle(self, *args, **options):
        csv_path = options['csv_path']
        clear_data = options['clear']

        # Check if file exists
        if not os.path.exists(csv_path):
            raise CommandError(f'CSV file not found: {csv_path}')

        try:
            # Clear existing data if requested
            if clear_data:
                count = Medical.objects.all().count()
                Medical.objects.all().delete()
                self.stdout.write(self.style.WARNING(f'Deleted {count} existing Medical records'))

            # Read CSV file
            df = pd.read_csv(csv_path)
            self.stdout.write(f'Loaded CSV with {len(df)} rows and columns: {list(df.columns)[:10]}...')

            # Get or create default doctor user
            doctor, created = User.objects.get_or_create(
                username='system_doctor',
                defaults={
                    'is_doctor': True,
                    'email': 'system@health.local',
                    'first_name': 'System',
                    'last_name': 'Doctor'
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS('Created system doctor user'))

            # Get or create default patient user
            patient, created = User.objects.get_or_create(
                username='system_patient',
                defaults={
                    'is_patient': True,
                    'email': 'patient@health.local',
                    'first_name': 'System',
                    'last_name': 'Patient'
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS('Created system patient user'))

            # Process and insert data
            batch_size = 1000
            medical_records = []
            errors = []

            for idx, row in df.iterrows():
                try:
                    # Extract columns (adjust based on your CSV structure)
                    s1 = str(row.get('s1', '') or '')[:200]
                    s2 = str(row.get('s2', '') or '')[:200]
                    s3 = str(row.get('s3', '') or '')[:200]
                    s4 = str(row.get('s4', '') or '')[:200]
                    s5 = str(row.get('s5', '') or '')[:200]
                    disease = str(row.get('disease', 'Unknown') or 'Unknown')[:200]
                    medicine = str(row.get('drug', row.get('medicine', '')) or '')[:200]

                    medical = Medical(
                        s1=s1,
                        s2=s2,
                        s3=s3,
                        s4=s4,
                        s5=s5,
                        disease=disease,
                        medicine=medicine,
                        patient=patient,
                        doctor=doctor
                    )
                    medical_records.append(medical)

                    # Batch insert
                    if len(medical_records) >= batch_size:
                        Medical.objects.bulk_create(medical_records)
                        self.stdout.write(f'  Inserted {len(medical_records)} records (row {idx + 1}/{len(df)})')
                        medical_records = []

                except Exception as e:
                    errors.append(f'Row {idx + 1}: {str(e)}')
                    continue

            # Insert remaining records
            if medical_records:
                Medical.objects.bulk_create(medical_records)
                self.stdout.write(f'  Inserted {len(medical_records)} remaining records')

            # Display results
            total_records = Medical.objects.count()
            self.stdout.write(self.style.SUCCESS(
                f'\nSuccessfully loaded {total_records} medical records into database'
            ))

            if errors:
                self.stdout.write(self.style.WARNING(
                    f'\n{len(errors)} errors occurred during import:'
                ))
                for error in errors[:10]:  # Show first 10 errors
                    self.stdout.write(self.style.WARNING(f'  {error}'))
                if len(errors) > 10:
                    self.stdout.write(self.style.WARNING(f'  ... and {len(errors) - 10} more errors'))

        except pd.errors.ParserError as e:
            raise CommandError(f'Error parsing CSV file: {str(e)}')
        except Exception as e:
            raise CommandError(f'Error loading data: {str(e)}')
