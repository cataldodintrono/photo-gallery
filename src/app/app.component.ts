import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, EventEmitter } from '@angular/core';
import { PhotoGalleryService } from './service/photo-gallery.service';
import { first } from 'rxjs/operators'
import { throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  change: EventEmitter<void> = new EventEmitter<void>();

  scrollTop: number;
  scrollLeft: number;
  innerHeight: number;
  customImages: any[] = [];

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeight = window.innerHeight;
  }
  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    let scroll = window.pageYOffset;
    scroll = Math.trunc(scroll + this.innerHeight);
    let numberRandom = 0;
    let element;
    document.getElementById("footer").style.display = "none";

    if (scroll === document.documentElement.scrollHeight) {
      numberRandom = Math.floor(Math.random() * (this.listImages.length - 1)) + 1;
      this.photoGalleryService.getImage(this.placeholder).pipe(first()).subscribe((response) => {

        element = response.data.children[numberRandom];

        if (element.data.thumbnail.includes("https")) {
          this.imagesScroll.push(element.data.thumbnail);
        } else {
          this.imagesScroll.push(this.imagesScroll[this.imagesScroll.length - 1]);
        }
        window.scroll({
          top: (document.documentElement.scrollHeight), //900
          left: 0,
          behavior: 'smooth'
        });
        document.getElementById("footer").style.display = "block";
        

      });


    }
  }

  title = 'project-test';
  image: any[] = [];
  listImages: any[] = [];
  index: number = 0;
  lengthListImage: number = 0;
  modalImage: string = '';
  placeholder: string = 'batman';
  imagesScroll: any[] = [];
  imageSelected = '';

  constructor(
    private photoGalleryService: PhotoGalleryService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.innerHeight = window.innerHeight;
    this.InitPhotoGalleryImages();
  }

  InitPhotoGalleryImages() {
    this.photoGalleryService.getImage(this.placeholder).subscribe((response) => {
      this.image = response.data.children;
      this.imagesScroll = response.data.children;

      this.image.forEach(element => {
        if (element.data.thumbnail.includes("https")) {
          this.listImages.push(element.data.thumbnail);
          this.lengthListImage = this.listImages.length;
        }
      });

      this.customImages = [...this.listImages];

      this.imagesScroll = this.imagesScroll.reduce((newList, element) => {
        if (element.data.thumbnail.includes("https")) {
          newList.push(element.data.thumbnail);
        }
        return newList.slice(0, 6);
      }, []);

    }, error => {
      this.handleError(error);
    });
  }

  onChangePlaceholder() {
    console.log(this.placeholder);
  }

  getPhotoGalleryImages() {
    this.photoGalleryService.getImage(this.placeholder).subscribe((response) => {
      this.image = response.data.children;
      this.image.forEach(element => {
        if (element.data.thumbnail.includes("https")) {
          this.listImages.push(element.data.thumbnail);
          this.lengthListImage = this.listImages.length;
        } else if (element.data.thumbnail === '') {
          let errorMessage = 'La ricerca effettuata dall\'utente non è corretta! Riprovare con parole diverse.';
          window.alert(errorMessage);
          this.placeholder = 'batman';
          this.listImages = [...this.customImages];
          this.getScrollGalleryImages();
          this.index = 0;
          return;
        }
      });

    }, error => {
      this.handleError(error);
    });
  }

  handleError(error) {
    let errorMessage = 'La ricerca effettuata dall\'utente non è corretta! Riprovare con parole diverse.';
    window.alert(errorMessage);
    this.placeholder = 'batman';
    this.callPhotoGalleryService();
    return throwError(errorMessage);
  }

  getScrollGalleryImages() {
    this.photoGalleryService.getImage(this.placeholder).subscribe((response) => {
      this.imagesScroll = response.data.children;
      this.imagesScroll = this.imagesScroll.reduce((newList, element) => {
        if (element.data.thumbnail.includes("https")) {
          newList.push(element.data.thumbnail);
        }
        return newList.slice(0, 6);
      }, []);
    }, error => {
    });
  }

  getIndex(index: number): number {
    return index;
  }

  getImage(): string {
    let image = '';
    image = this.listImages[this.index];
    return image;
  }

  manageIndex(type: string) {
    this.imageSelected = '';
    switch (type) {
      case 'next':
        if (this.index === this.listImages.length - 1) {
          this.index = 0;
        } else {
          this.index += 1;
        }
        break;
      case 'prev':
        if (this.index <= 0) {
          this.index = this.listImages.length - 1;
        } else {
          this.index -= 1;
        }
        break;
    }
  }

  getName(index: number): string {
    return `${this.placeholder} - image: ${index + 1}`;
  }

  getListImage(): string[] {
    let images = [];
    let indexList = 0;
    if (this.index === 0 || this.index > 4) {
      indexList = this.index;
    }
    images = this.listImages.slice(indexList, indexList + 5);
    return images;
  }

  openPreviewImage(image: string, type: string) {
    if (type === null) {
      this.imageSelected = image;
    }
    this.modalImage = image;

    this.listImages.forEach((elem, index) => {
      if (elem.toUpperCase() === image.toUpperCase()) {
        this.index = index;
        return;
      }
    });
  }

  onCloseModal() {
    this.modalImage = '';
  }

  callPhotoGalleryService() {
    this.listImages = [];
    this.index = 0;
    this.getPhotoGalleryImages();
    this.getScrollGalleryImages();
  }
}
