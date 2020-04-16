import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Subscription } from 'rxjs';

import * as baseLocation from '../../config/base_location.json';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) { }

  products: any;
  productDetails: any;
  keyword = 'name';
  busy: Subscription;
  apiLink: string = baseLocation.base_backoffice;

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
        if (data.images) {
          this.products = data.images;
        }

        if (data.article_type) {

          data.article_type.forEach(element => {
            this.articleTypes.push(element.article_type);
          });
        }

        if (data.base_colour) {

          data.base_colour.forEach(element => {
            this.baseColours.push(element.base_colour);
          });
        }

        if (data.gender) {

          data.gender.forEach(element => {
            this.genders.push(element.gender);
          });
        }
        if (data.master_category) {

          data.master_category.forEach(element => {
            this.masterCategories.push(element.master_category);
          });
        }
        if (data.sub_category) {

          data.sub_category.forEach(element => {
            this.subCategories.push(element.sub_category);
          });
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
        event.target.reset();
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

}
