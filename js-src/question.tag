<question>
    <h1 class="heading">{ opts.question.heading }</h1>
    <p class="description"><raw content="{ opts.question.description }"></raw></p>

    <h2 class="question-title">{ opts.question.question }</h2>
    <ul class="choices">
        <li each="{ opts.question.choices }"><input name="choice" class="choice" type="radio" value="{ to }" onchange="{ onChange }" />{ text }</li>
    </ul>
    <button class="back-button is-hidden" onclick="{ parent.displayPrev }">Back</button>
    <button class="disabled next-button" disabled onclick="{ parent.displayNext }">Next</button>
    <button class="enter-button is-hidden" onclick="{ parent.displayEnd }">Enter</button>

    onChange() {
        if ($("input[type=radio]:checked", this.root).length > 0) {
            $(".next-button", this.root).prop("disabled", false);
            $(".next-button", this.root).removeClass("disabled");
        } else {
            $(".next-button", this.root).prop("disabled", true);
            $(".next-button", this.root).addClass("disabled");
        }
        this.update();
    }

    doUpdate() {
        if (this.opts.question.canEnter) {
            $(".next-button, .back-button", this.root).addClass("is-hidden");
            $(".enter-button", this.root).removeClass("is-hidden");
        } else {
            if (this.parent.log.length > 1) {
                $(".back-button", this.root).removeClass("is-hidden");
            } else {
                $(".back-button", this.root).addClass("is-hidden");
            }
            if (opts.question.choices === null) {
                $(".next-button", this.root).addClass("is-hidden");
            } else {
                $(".next-button", this.root).removeClass("is-hidden");
            }
            this.onChange();
        }
    }
</question>