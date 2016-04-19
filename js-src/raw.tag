<raw>
    <span></span>

    updateContent() {
        this.root.innerHTML = opts.content;
    }

    this.on('update', function() {
        this.updateContent();
    });

   this.updateContent();
</raw>