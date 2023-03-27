import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChocoService } from '../choco/choco.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  currentFile?: File;
  progress = 0;
  message = '';
  fileName = '选择文件';
  uploadPath = '';
  constructor(private choco: ChocoService) {}

  async ngOnInit(): Promise<void> {
    this.uploadPath = (
      (await this.choco.getAsync('upload/path')) as { path: string }
    )['path'];
  }

  selectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.fileName = this.currentFile.name;
    } else {
      this.fileName = '选择文件';
    }
  }
  upload(): void {
    this.progress = 0;
    this.message = '';
    if (this.currentFile) {
      this.choco.upload(this.currentFile).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
          }
        },
        error: (err: any) => {
          console.log(err);
          this.progress = 0;
          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = '上传文件失败!';
          }
          this.currentFile = undefined;
        },
      });
    }
  }
}
