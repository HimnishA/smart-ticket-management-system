import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-confirm-assign-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirm Assignment</h2>

    <mat-dialog-content>
      Are you sure you want to assign this ticket to
      <strong>{{ data.agentName }}</strong>?
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="confirm()">
        Confirm
      </button>
    </mat-dialog-actions>
  `
})
export class ConfirmAssignDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmAssignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { agentName: string }
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
