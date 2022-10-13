import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/_models/member';
import { MemberService } from 'src/app/_services/member.service';
import {NgxGalleryAnimation} from '@kolkov/ngx-gallery';


@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
  member:Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private memberService:MemberService, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember();

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation : NgxGalleryAnimation.Slide,
        preview: false
      }
    ]
  }  

  getImages() : NgxGalleryImage[] {
    const imageUrls = [];
    for(const photo of this.member.photos ) {
          imageUrls.push({
            small : photo?.url,
            medium: photo?.url,
            big: photo?.url
          });
    }

    return imageUrls;

  }

  loadMember() {
    this.memberService.getMember(this.route.snapshot.paramMap.get('username') || '{}')
      .subscribe((member: Member) => {
        this.member = member;
        this.galleryImages = this.getImages();
      });
    ;
  }
}
