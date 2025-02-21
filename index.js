class DragDropManager {
    constructor(selector) {
        this.draggedElement = null;
        this.items = document.querySelectorAll(selector);
        this.isDragging = false;
        this.init();
    }

    init() {
        this.items.forEach(item => {
            item.setAttribute('draggable', true);
            this.attachEventListeners(item);
        });
    }

    attachEventListeners(item) {
        const handlers = {
            dragstart: this.handleDragStart.bind(this),
            dragend: this.handleDragEnd.bind(this),
            dragover: this.handleDragOver.bind(this),
            dragleave: this.handleDragLeave.bind(this),
            drop: this.handleDrop.bind(this)
        };

        Object.entries(handlers).forEach(([event, handler]) => {
            item.addEventListener(event, handler);
        });
    }

    handleDragStart(event) {
        this.draggedElement = event.target;
        this.isDragging = true;

        requestAnimationFrame(() => {
            event.target.classList.add('dragging');
        });

        event.target.style.opacity = '0.6';
    }

    handleDragEnd(event) {
        this.isDragging = false;
        this.draggedElement = null;

        event.target.style.opacity = '';
        event.target.classList.remove('dragging');
        this.items.forEach(item => item.classList.remove('drop-target'));
    }

    handleDragOver(event) {
        event.preventDefault();
        const target = event.target;

        if (!this.isDragging || target === this.draggedElement) return;

        target.classList.add('drop-target');
    }

    handleDragLeave(event) {
        event.target.classList.remove('drop-target');
    }

    handleDrop(event) {
        event.preventDefault();
        const dropTarget = event.target;

        if (!this.draggedElement || dropTarget === this.draggedElement) return;

        const allItems = [...this.items];
        const draggedIndex = allItems.indexOf(this.draggedElement);
        const dropIndex = allItems.indexOf(dropTarget);

        const parent = dropTarget.parentNode;
        const nextSibling = dropIndex < draggedIndex ? dropTarget : dropTarget.nextSibling;
        parent.insertBefore(this.draggedElement, nextSibling);

        dropTarget.classList.remove('drop-target');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DragDropManager('li');
});
