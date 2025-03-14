Vue.component('create-task', {
    template: `
        <div class="createBlockTask">
            <form @submit.prevent="onSubmit" class="block">
                <label for="title" class="textInBlock">Title</label>
                <input type="text" v-model="title" required>
                
                <ol>
                    <li v-for="(step, index) in steps" :key="index" class="section textInBlock">
                        <input type="text" v-model="step.text" placeholder="Введите шаг" required>
                    </li>
                </ol>
                
                <div>
                    <button type="button" @click="addStep">добавить шаг</button>
                    <button type="button" @click="removeStep" :disabled="steps.length === 0">убавить шаг</button>
                </div>
                
                <button type="submit" :disabled="steps.length === 0">отправить</button>
            </form>
        </div>
    `,
    data() {
        return {
            title: '',
            steps: [],
            completedDate: ''
        };
    },
    methods: {
        onSubmit() {
            let task = {
                title: this.title,
                steps: this.steps,
                completedDate: this.completedDate
            };
            this.$emit('task-created', task);
            this.title = '';
            this.steps = [];
        },
        addStep() {
            this.steps.push({ text: '', done: false });
        },
        removeStep() {
            if (this.steps.length > 0) {
                this.steps.pop();
            }
        }
    }
});


Vue.component('third-task-list', {
    props: {
        tasks: {
            type: Array,
            required: true
        }
    },
    template: `
        <div class="task-list">
            <h2>Третий лист</h2>
            <ol>
                <li v-for="(task, index) in tasks" :key="index" v-if="thirdTaskIf(task)">
                    <strong>{{ task.title }}</strong>
                    <ol>
                        <li v-for="(step, stepIndex) in task.steps" :key="stepIndex">
                            <p>{{ step.text }} - <input type="checkbox" v-model="step.done"></p>                
                        </li>
                    </ol>
                    <p>Дата завершения: {{ task.completionDate }}</p>
                </li>
            </ol>
        </div>
    `,
    methods: {
        thirdTaskIf(task) {
            let trueDone = task.steps.filter(step => step.done).length;
            let fullLength = task.steps.length;


            if (fullLength === 0) {
                return false;
            }

            if (trueDone == fullLength){
                let completedDate = new Date().toLocaleDateString()
            }

            return trueDone == fullLength;
        }
    },
    watch: {
        tasks: {
            handler(newTasks) {
                localStorage.setItem("tasks", JSON.stringify(newTasks));
            },
            deep: true
        }
    }
});



Vue.component('second-task-list', {
    props: {
        tasks: {
            type: Array,
            required: true
        }
    },
    template: `
        <div class="task-list">
            <h2>Второй лист</h2>
            <ol>
                <li v-for="(task, index) in tasks" :key="index" v-if="secondTaskIf(task)">
                    <strong>{{ task.title }}</strong>
                    <ol>
                        <li v-for="(step, stepIndex) in task.steps" :key="stepIndex">
                            <p>{{ step.text }} - <input type="checkbox" v-model="step.done"></p>                
                        </li>
                    </ol>
                </li>
            </ol>
        </div>
    `,
    methods: {
        secondTaskIf(task) {
            let trueDone = task.steps.filter(step => step.done).length;
            let fullLength = task.steps.length;


            if (fullLength === 0) {
                return false;
            }

            return (trueDone > fullLength / 2 || trueDone == fullLength / 2) && trueDone < fullLength;
        }
    },
    watch: {
        tasks: {
            handler(newTasks) {
                localStorage.setItem("tasks", JSON.stringify(newTasks));
            },
            deep: true
        }
    }
});

Vue.component('first-task-list', {
    props: {
        tasks: {
            type: Array,
            required: true
        }
    },
    template: `
        <div class="task-list">
            <h2>Первый лист</h2>
            <ol>
                <li v-for="(task, index) in tasks" :key="index" v-if="firstTaskIf(task)">
                    <strong>{{ task.title }}</strong>
                    <ol>
                        <li v-for="(step, stepIndex) in task.steps" :key="stepIndex">
                            <p>{{ step.text }} - <input type="checkbox" v-model="step.done"></p>                
                        </li>
                    </ol>
                </li>
            </ol>
        </div>
    `,
    methods: {
        firstTaskIf(task) {
            let trueDone = task.steps.filter(step => step.done).length;
            let fullLength = task.steps.length;
            return trueDone < fullLength / 2;
        }
    },
    watch: {
        tasks: {
            handler(newTasks) {
                localStorage.setItem("tasks", JSON.stringify(newTasks));
            },
            deep: true
        }
    }
});

let app = new Vue({
    el: '#app',
    data() {
        let tasks = [];
        if (localStorage.getItem("tasks")) {
            tasks = JSON.parse(localStorage.getItem("tasks"));
        }
        return {
            tasks: tasks
        };
    },
    methods: {
        addTask(task) {
            this.tasks.push(task);
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        },
        updateLocalStorage() {
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        }
    },
    template: `
        <div>
            <create-task @task-created="addTask"></create-task>
            <first-task-list :tasks="tasks"></first-task-list>
            <second-task-list :tasks="tasks"></second-task-list>
            <third-task-list :tasks="tasks"></third-task-list>
        </div>
    `
});
