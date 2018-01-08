import { Component, ViewChild, Inject } from '@angular/core';
import { AngularCropperjsComponent } from 'angular-cropperjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // cropperjs setting
  imageUrl = null;
  croppedImage = null;
  @ViewChild(AngularCropperjsComponent) angularCropper: AngularCropperjsComponent;
  config = Object.assign({
    checkCrossOrigin: false,
    zoomable: true,
    zoom: function(value) {
      this.zoomCallback(value);
    }.bind(this)
  });

  // slider values to zoom image
  sliderValue = 0;
  preValue = 0;

  constructor(public dialog: MatDialog) {

  }

  /**
   * Reset all data for new image
   */
  reset() {
    this.imageUrl = null;
    this.croppedImage = null;
    this.sliderValue = 0;
    this.preValue = 0;
  }

  /**
   * Zoom in action when click button "+"
   */
  zoomIn() {
    this.angularCropper.cropper.zoom(0.1);
  }

  /**
   * Zoom out action when click button "-"
   */
  zoomOut() {
    this.angularCropper.cropper.zoom(-0.1);
  }

  /**
   * On change value of slider
   */
  onChange() {
    this.angularCropper.cropper.zoom((this.sliderValue - this.preValue)/100);
  }

  /**
   * Action callback when have zoom image
   * @param value zoom value
   */
  zoomCallback(value) {
    var oldRatio = value.detail.oldRatio;
    var newRatio = value.detail.ratio;

    if (this.preValue === this.sliderValue) {
      this.sliderValue = this.preValue + Math.floor((newRatio - oldRatio) * 100);
    }
    this.preValue = this.sliderValue;
  }

  /**
   * 
   * @param fileInput data file when select new image
   */
  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      var reader = new FileReader();
      this.reset();
      reader.onload = function (e : any) {
          //$('#preview').attr('src', e.target.result);
          console.log(e.target.result);
          this.imageUrl = e.target.result;
      }.bind(this);

      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  /**
   * show dialog when click button "crop"
   */
  cropEvent() {
    //this.croppedImage = this.angularCropper.cropper.getCroppedCanvas().toDataURL();
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '400px',
      data: { imageData:  this.angularCropper.cropper.getCroppedCanvas().toDataURL()}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

/**
 * Dialog component
 */
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {
  croppedImage = null;

  // constructor for dialog
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  /**
   * close dialog when click outside of it
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

}
