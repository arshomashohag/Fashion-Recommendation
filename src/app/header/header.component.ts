import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $(window).scroll(function () {
      if ($(document).scrollTop() > 50) {
        $('.nav').addClass('affix');
      } else {
        $('.nav').removeClass('affix');
      }
    });

    $('.navTrigger').click(function () {
      $(this).toggleClass('active');
      console.log("Clicked menu");
      $("#mainListDiv").toggleClass("show_list");
      $("#mainListDiv").fadeIn();

    });
  }

}
