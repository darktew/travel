import { Directive, HostBinding, HostListener, Output, EventEmitter, OnInit } from '@angular/core';
import { Subject } from '../../../node_modules/rxjs';
import { switchMap, takeUntil, repeat, take, delay } from 'rxjs/operators';

@Directive({
    selector: '[appDraggaleRx]'
})
export class DraggaleRxDirective implements OnInit {
    //HostBinding
    @HostBinding('class.draggable') draggle = true;
    @HostBinding('class.dragging') dragging = false;
    //Output
    @Output() dragStart = new EventEmitter<PointerEvent>();
    @Output() dragMove = new EventEmitter<PointerEvent>();
    @Output() dragEnd = new EventEmitter<PointerEvent>();

    private pointerDown = new Subject<PointerEvent>();
    private pointerMove = new Subject<PointerEvent>();
    private pointerUp = new Subject<PointerEvent>();

    @HostListener('pointerdown', ['$event'])
    onpointerdown(event: PointerEvent): void {
        this.pointerDown.next(event);
    }

    @HostListener('document:pointermove', ['$event'])
    onpointermove(event: PointerEvent): void {
        this.pointerMove.next(event);
    }
    @HostListener('document:pointerup', ['$event'])
    onpointerup(event: PointerEvent): void {
        this.pointerUp.next(event);
    }
    constructor() { }
    ngOnInit(): void {
        // stram of dragStart
        this.pointerDown.asObservable()
            .subscribe(event => {
                this.dragging = true;
                this.dragStart.emit(event);
            });

        // stram of dragMove
        this.pointerDown.pipe(
            switchMap(() => this.pointerMove),
            takeUntil(this.pointerUp),
            repeat()
        ).subscribe(event => this.dragMove.emit(event));;
        // stram of dragEnd
        this.pointerDown.pipe(
            switchMap(() => this.pointerUp),
            take(1),
            repeat()
        ).subscribe(event => {
            this.dragging = false;
            this.dragEnd.emit(event);
        });;
    }
}
