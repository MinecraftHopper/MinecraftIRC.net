<questions>
    <question question="{ currentQuestion }"></question>

    <script>
        this.log = [];
        this.currentQuestion = {};
        let self = this;

        displayQuestion(name) {
            this.currentQuestion = this.questions[name];
            this.update();
            this.tags.question.doUpdate();
        }

        displayNext(_, to) {
            if (typeof to === 'undefined') {
                to = $("input.choice:checked", this.root).attr("value");
            }
            this.log.push(to);
            this.displayQuestion(to);
        }

        displayPrev() {
            this.log.pop();
            this.displayQuestion(this.log[this.log.length - 1]);
        }

        displayStartOver() {
            this.log = [];
            this.displayQuestion(self.config.startQuestion);
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
    </script>
</questions>