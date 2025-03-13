Vue.component('first-table',{
    template:`
    <div></div>
    `
})

Vue.component('two-table',{
    template:`
    <div></div>
    `
})


// emit
Vue.component('create-task', {
    template: `
        <div class="createBlockTask">
            <form @submit.prevent="onSubmit" class="block">
                <label for="title" class="textInBlock">Title</label>
                <input type="text" v-model="title" required>
                
                <ol>
                    <li v-for="(step, id) in steps" :key="id" class="section textInBlock">
                        <input type="text" v-model="steps[id]" placeholder="Введите шаг" required>
                    </li>
                </ol>
                
                <div>
                    <button type="button" @click="addTask">добавить</button>
                    <button type="button" @click="removeTask" :disabled="steps.length === 0">убавить</button>
                </div>
                
                <button type="submit" :disabled="steps.length === 0" >отправить</button>
            </form>
        </div>
    `,
    data() {
        return {
            tasks: [],
            title: '',
            steps: []
        };
    },
    methods: {
        onSubmit() {
            const task = {
                title: this.title,
                steps: this.steps
            };
            console.log(task);
            localStorage.setItem("task", JSON.stringify(task));


        },
        addTask() {
            this.steps.push('');
        },
        removeTask() {
            if (this.steps.length > 0) {
                this.steps.pop();
            }
        }
    }
});


let app = new Vue({
    el: '#app'
});

