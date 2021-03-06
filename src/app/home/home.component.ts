import { Component, OnInit, SystemJsNgModuleLoader, AfterViewInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Subscription } from 'rxjs';

import * as baseLocation from '../../config/base_location.json';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(
    private apiService: ApiService
  ) { }

  products: any;
  productDetails: any;
  keyword = 'name';
  busy: Subscription;
  apiLink: string = baseLocation.base_backoffice;

  trendingItems: any;
  middleBanner: any = [];

  masterCategories: any;
  masterCategory: any;
  masterCatFocus: any;

  subCategories: any;
  subCategory: any;
  subCatFocus: any;

  articleTypes: any;
  articleType: any;
  typeFocus: any;

  baseColours: any;
  color: any;
  colorFocus: any;

  genders: any;
  gender: any;

  searchedImage: any;
  
  p: any;

  ngOnInit() {
    this.p = 1;
    this.masterCategories = [];
    this.subCategories = [];
    this.articleTypes = [];
    this.baseColours = [];
    this.genders = [];
    this.products = [];

    this.busy = this.apiService.fetchHomePageValues().subscribe(
      (data: any) => {
        try {

          if (data.success) {


            if (data.data.images) {
              this.products = data.data.images;
              this.middleBanner = [];

              this.middleBanner.push(this.products[ Math.floor(this.getRandomIntInclusive(1, 99)) ])
              this.middleBanner.push(this.products[ Math.floor(this.getRandomIntInclusive(1, 99)) ])
            }

            if (data.data.article_type) {
              this.articleTypes = data.data.article_type
              // data.data.article_type.forEach(element => {
              //   this.articleTypes.push(element.article_type);
              // });
            }

            if (data.data.base_colour) {
              this.baseColours = data.data.base_colour;
              // data.data.base_colour.forEach(element => {
              //   this.baseColours.push(element.base_colour);
              // });
            }

            if (data.data.gender) {
              this.genders = data.data.gender;
              // data.data.gender.forEach(element => {
              //   this.genders.push(element.gender);
              // });
            }
            if (data.data.master_category) {

              // data.data.master_category.forEach(element => {
              //   this.masterCategories.push(element.master_category);
              // });
              this.masterCategories = data.data.master_category;
            }
            if (data.data.sub_category) {

              // data.data.sub_category.forEach(element => {
              //   this.subCategories.push(element.sub_category);
              // });
              this.subCategories = data.data.sub_category;
            }
            if (data.data.trending) {

              let trending_items = data.data.trending
              this.trendingItems = {}

              trending_items.forEach(item => {

                if (!this.trendingItems[item.masterCategory]) {
                  this.trendingItems[item.masterCategory] = []
                }

                this.trendingItems[item.masterCategory].push(item);

              });

              console.log(this.trendingItems);

            }

          } else {

            alert(data.message)

          }

        } catch (e) {

          console.log(e)
        }

      },
      (error) => {

      },
      () => {
        this.busy.unsubscribe();


      }
    )

    $("body").click((e) => {
      this.masterCatFocus = false;
      this.subCatFocus = false;
      this.typeFocus = false;
      this.colorFocus = false;

      if (e.target.id == "master-category") {
        this.masterCatFocus = true
      } else if (e.target.id == "sub-category") {
        this.subCatFocus = true
      } else if (e.target.id == "article-type") {
        this.typeFocus = true
      } else if (e.target.id == "base-color") {
        this.colorFocus = true
      }
    });


    $("#imageUpload").change((e) => {
      this.readURL(e.target);
    });
  }
  ngAfterViewInit() {
    setTimeout(() => {
      $('.popular-slider').owlCarousel({
        items: 1,
        autoplay: true,
        autoplayTimeout: 5000,
        smartSpeed: 400,
        animateIn: 'fadeIn',
        animateOut: 'fadeOut',
        autoplayHoverPause: true,
        loop: true,
        nav: true,
        merge: true,
        dots: false,
        navText: ['<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>'],
        responsive: {
          0: {
            items: 1,
          },
          300: {
            items: 1,
          },
          480: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1170: {
            items: 4,
          },
        }
      });
    }, 1000)
  }

  showDetails(type, event) {

    if (type == 'in') {

      $(event.target.parentElement).next().addClass('card-show')

    } else {

      $(event.target.parentElement).next().removeClass('card-show')

    }

  }

  search(event) {

    event.preventDefault();
    

    let data = new FormData();

    if (this.masterCategory) {
      data.set('master_category', this.masterCategory);
    }

    if (this.subCategory) {
      data.set('sub_category', this.subCategory)
    }

    if (this.articleType) {
      data.set('article_type', this.articleType)
    }

    if (this.gender) {
      data.set('gender', this.gender)
    }

    if (this.color) {
      data.set('base_colour', this.color)
    }

    if(this.searchedImage){

      data.set('file', this.searchedImage);
    }

    console.log(this.searchedImage);

    this.busy = this.apiService.searchForProduct(data).subscribe(
      (data: any) => {
        this.p = 1;
        if (data.success) {
          let prods = data.data;

          // prods.sort(() => 0.5 - Math.random());
          prods.sort((a, b)=>{
            return b.similarity - a.similarity
          })
          this.products = prods.slice(0, 100);

        } else {
          alert(data.message);
        }
      },
      (error) => {
        alert(error.message)
      },
      () => {
        this.busy.unsubscribe();
        // event.target.reset();
      }
    )
  }

  readURL(input) {
    if (input.files && input.files[0]) { 
      let reader = new FileReader();
      reader.onload = function (e) { 
        $('#imagePreview').css('background-image', 'url(' + reader.result + ')');
        $('#imagePreview').hide();
        $('#imagePreview').fadeIn(650);
      }
      reader.readAsDataURL(input.files[0]);
      this.searchedImage = input.files[0];
    }

  }

  resetForm(){
    this.searchedImage = null;
    console.log('Reseting image')
    $("#imagePreview").css('background-image', 'url(http://i.pravatar.cc/500?img=7)' );
    $('#imagePreview').hide();
    $('#imagePreview').fadeIn(650);
  }

  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }

}
