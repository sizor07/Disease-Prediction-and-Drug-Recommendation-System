from django.contrib import admin
from .models import User, Profile, Medical, Ment


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_patient', 'is_doctor', 'is_staff')
    list_filter = ('is_patient', 'is_doctor', 'is_staff')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'phonenumber')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_patient', 'is_doctor', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )


@admin.register(Medical)
class MedicalAdmin(admin.ModelAdmin):
    list_display = ('disease', 'patient', 'doctor', 'created_on')
    list_filter = ('created_on', 'disease')
    search_fields = ('disease', 'medicine', 'patient__username')
    readonly_fields = ('created_on',)
    fieldsets = (
        ('Symptoms', {'fields': ('s1', 's2', 's3', 's4', 's5')}),
        ('Diagnosis', {'fields': ('disease', 'medicine')}),
        ('Relations', {'fields': ('patient', 'doctor')}),
        ('Timestamp', {'fields': ('created_on',)}),
    )


@admin.register(Ment)
class MentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'approved', 'ment_day', 'created_on')
    list_filter = ('approved', 'created_on', 'ment_day')
    search_fields = ('patient__username', 'doctor__username')
    readonly_fields = ('created_on',)
    fieldsets = (
        ('Appointment Details', {'fields': ('patient', 'doctor', 'ment_day', 'time')}),
        ('Medical Record', {'fields': ('medical',)}),
        ('Status', {'fields': ('approved',)}),
        ('Timestamp', {'fields': ('created_on',)}),
    )


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'gender', 'country', 'region')
    list_filter = ('gender', 'country')
    search_fields = ('user__username', 'region')
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Personal Information', {'fields': ('avatar', 'birth_date', 'gender')}),
        ('Location', {'fields': ('region', 'country')}),
    )