from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
# from phonenumber_field.modelfields import PhoneNumberField
from enum import Enum

class User(AbstractUser):
    pass

class Athlete(models.Model):
    class Division(models.TextChoices):
        JUNIOR = 'JR', _('Junior')
        SENIOR = 'SR', _('Senior')
        MASTERS = 'MA', _('Masters')

    class Status(models.TextChoices):
        ACTIVE = 'AC', _('Active')
        INACTIVE = 'IN', _('Inactive')
        INJURED = 'IJ', _('Injured')

    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='athletes',
        help_text=_("The user associated with this athlete.")
    )
    
    name = models.CharField(
        max_length=100,
        help_text=_("Full name of the athlete.")
    )
    
    age = models.PositiveIntegerField(
        help_text=_("Age of the athlete.")
    )
    
    division = models.CharField(
        max_length=2,
        choices=Division.choices,
        help_text=_("Competing division of the athlete.")
    )
    
    status = models.CharField(
        max_length=2,
        choices=Status.choices,
        default=Status.ACTIVE,
        help_text=_("Current status of the athlete.")
    )
    
    ranking = models.PositiveIntegerField(
        null=True, 
        blank=True,
        help_text=_("Current ranking of the athlete (if applicable).")
    )
    
    phone = models.CharField(
           max_length=2,
        help_text=_("Contact phone number for the athlete.")
    )

    class Meta:
        verbose_name = _("Athlete")
        verbose_name_plural = _("Athletes")
        ordering = ['name', 'ranking']
        unique_together = ['user', 'name']  # Assuming an athlete name should be unique per user

    def __str__(self):
        return f"{self.name} ({self.get_division_display()})"

    def is_active(self):
        return self.status == self.Status.ACTIVE

    def promote_division(self):
        if self.division == self.Division.JUNIOR:
            self.division = self.Division.SENIOR
        elif self.division == self.Division.SENIOR:
            self.division = self.Division.MASTERS
        self.save()