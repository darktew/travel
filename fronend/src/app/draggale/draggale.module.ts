import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggaleDirective } from './draggale.directive';
import { DraggaleRxDirective } from './draggable-rx.directive';
import { MovableDirective } from './movable.directive';
import { MovableAreaDirective } from './movable-area.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DraggaleDirective, MovableDirective, MovableAreaDirective],
  exports: [DraggaleDirective, MovableDirective, MovableAreaDirective]
})
export class DraggaleModule { }
