import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss']
})
export class NotificationSettingsComponent implements OnInit {
  settingsForm!: FormGroup;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error' = 'idle';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    // Create a form with mock notification settings
    this.settingsForm = this.fb.group({
      emailSettings: this.fb.group({
        citations: [true],
        newFollowers: [true],
        comments: [true],
        newPapers: [true],
        mentions: [true],
        collaborationInvites: [true],
        messages: [false],
        digest: [true]
      }),
      inAppSettings: this.fb.group({
        citations: [true],
        newFollowers: [true],
        comments: [true],
        newPapers: [true],
        mentions: [true],
        collaborationInvites: [true],
        messages: [true]
      }),
      digestFrequency: ['daily']
    });
  }

  saveSettings(): void {
    this.saveStatus = 'saving';
    
    // Simulate a network request
    setTimeout(() => {
      // In a real app, we would call a service here
      console.log('Settings saved:', this.settingsForm.value);
      this.saveStatus = 'saved';
      
      // Reset status after 3 seconds
      setTimeout(() => {
        this.saveStatus = 'idle';
      }, 3000);
    }, 1500);
  }
} 