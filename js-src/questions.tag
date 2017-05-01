<questions>
    <question question="{ currentQuestion }"></question>

    this.log = [];
    this.currentQuestion = {};
    var self = this;

    displayQuestion(name) {
        this.currentQuestion = this.questions[name];
        this.update();
        this.tags.question.doUpdate();
    }

    displayNext() {
        var to = $("input.choice:checked", this.root).attr("value");
        this.log.push(to);
        this.displayQuestion(to);
    }

    displayPrev() {
        this.log.pop();
        this.displayQuestion(this.log[this.log.length - 1]);
    }

    displayEnd() {
        $("question", this.root).addClass("is-hidden");
        $(self.config.onExit).removeClass("is-hidden");
    }

    $.getJSON(opts.source, function (obj) {
        self.config = obj;
        console.log(obj);
        self.questions = self.config.questions;

        self.log.push(self.config.startQuestion);

        self.displayQuestion(self.config.startQuestion);

    });
</questions>