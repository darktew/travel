import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggaleDirective } from './draggale.directive';
import { DraggaleRxDirective } from './draggable-rx.directive';
import { MovableDirective } from './movable.directive';
import { MovableAreaDirective } from './movable-area.directive';
import { DraggableHelperDirective } from './draggable-helper.directive';
import { OverlayModule } from '../../../node_modules/@angular/cdk/overlay';
import { DropzoneDirective } from './dropzone.directive';
import { DroppableDirective } from './droppable.directive';
import { DroppableService } from './droppable.service';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule
  ],
  declarations: [
    DraggaleDirective, 
    MovableDirective, 
    MovableAreaDirective, 
    DraggableHelperDirective, 
    DropzoneDirective, 
    DroppableDirective
  ],
  exports: [
    DraggaleDirective, 
    MovableDirective, 
    MovableAreaDirective,
    DraggableHelperDirective,
    DropzoneDirective, 
    DroppableDirective
  ],
  providers: [
    DroppableService
  ]
})
export class DraggaleModule { }
