"""
Django REST Framework serializers for core app models.
"""

from rest_framework import serializers
from .models import User, Medical, Ment, Profile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'phonenumber', 
                  'is_patient', 'is_doctor', 'date_joined')
        read_only_fields = ('id', 'date_joined')


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ('id', 'user', 'avatar', 'birth_date', 'region', 'gender', 'country')


class MedicalSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.get_full_name', read_only=True, allow_null=True)

    class Meta:
        model = Medical
        fields = ('id', 's1', 's2', 's3', 's4', 's5', 'disease', 'medicine', 
                  'patient', 'patient_name', 'doctor', 'doctor_name', 'created_on')
        read_only_fields = ('id', 'created_on')


class MentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.get_full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.get_full_name', read_only=True, allow_null=True)
    medical_details = MedicalSerializer(source='medical', read_only=True)

    class Meta:
        model = Ment
        fields = ('id', 'approved', 'time', 'patient', 'patient_name', 'doctor', 
                  'doctor_name', 'ment_day', 'medical', 'medical_details', 'created_on')
        read_only_fields = ('id', 'created_on')
