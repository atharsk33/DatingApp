import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Photo } from 'src/app/_models/photo';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css']
})
export class PhotoManagementComponent implements OnInit {

  unApprovedphotos:Photo[];

  constructor(private adminService: AdminService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getPhotosForApproval();
  }

  getPhotosForApproval() {
      this.adminService.getPhotosForApproval().subscribe((photos: Photo[]) => {
        this.unApprovedphotos = photos;
        console.log(photos);
      });
  }

  approvePhoto(photoId: number) {
    this.adminService.approvePhoto(photoId).subscribe(() => {
      this.toastr.success("Photo approved succesfully!");
      this.unApprovedphotos.splice(this.unApprovedphotos.findIndex(p => p.id == photoId), 1);
    })
  }

  rejectPhoto(photoId: number) {
    this.adminService.rejectPhoto(photoId).subscribe(() => {
      this.toastr.error("Photo rejected");
      this.unApprovedphotos.splice(this.unApprovedphotos.findIndex(p => p.id == photoId), 1);
    });
  }

}
