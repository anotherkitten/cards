import { Component, inject, OnInit } from '@angular/core';
import { SaveService } from '../../services/save/save';
import { interval } from 'rxjs';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-save',
  imports: [FaIconComponent, FormsModule],
  templateUrl: './save.html',
  styleUrl: './save.css',
})
export class SaveComponent implements OnInit {
  saveService: SaveService = inject(SaveService);
  lastSaved: String = '0 seconds ago';
  nameInput = '';
  iconLoad = faArrowRightToBracket;
  
  ngOnInit() {
    interval(1e3).subscribe(() => this.setLastSaved());
    this.setLastSaved();
  }

  createProfile() {
    if (!this.nameInput.trim()) return;
    this.saveService.createProfile(this.nameInput);
  }

  switchProfile(name: String) {
    this.saveService.switchProfile(name);
  }

  renameProfile() {
    if (!this.nameInput.trim()) return;
    this.saveService.renameProfile(this.nameInput);
  }

  setLastSaved() {
    const diff = Math.floor((Date.now() - this.saveService.lastSaved) / 1e3);
    this.lastSaved = `${diff} second${diff - 1 ? 's' : ''} ago`;
  }
}
