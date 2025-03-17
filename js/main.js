Vue.component('create-task', {
    props:{
        firstTableTasks: {
            type: Number,
            required: true
        }

    },
    template: `
        <div class="createBlockTask">
            <form @submit.prevent="onSubmit" class="block">
                <label for="title" class="textInBlock">Title</label>
                <input type="text" v-model="title" required placeholder="Заголовок">
                
                <ol>
                    <li v-for="(step, index) in steps" :key="index" class="section textInBlock">
                        <input type="text" v-model="step.text" placeholder="Введите задачу" required>
                    </li>
                </ol>
                
                <div>
                    <button type="button" @click="addStep" :disabled="steps.length === 5" >добавить шаг</button>
                    <button type="button" @click="removeStep" :disabled="steps.length <= 3 ">убавить шаг</button>
                </div>
                
                <button type="submit" :disabled="steps.length === 0  ">отправить</button>
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
            let hasOnlySpaces = this.steps.some(step => step.text.trim() === '');
            if (hasOnlySpaces) {
                alert("Ошибка, нельзя писать только пробелы.");

            }else{
                if (this.firstTableTasks >= 3){
                    this.title = '';
                    this.steps = [];
                    alert("Первый столбик переполнен")
                }else{
                    let task = {
                        title: this.title,
                        steps: this.steps,
                        completedDate: this.completedDate
                    };
                    this.$emit('task-created', task);
                    this.title = '';
                    this.steps = [];
                }
            }


        },
        addStep() {
            if (this.steps.length === 0) {
                for (let i = 0; i < 3; i++) {
                    this.steps.push({ text: '', done: false });
                }
            } else if (this.steps.length < 5) {
                this.steps.push({ text: '', done: false });
            }
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
            
                <div v-for="(task, index) in tasks" :key="index" v-if="thirdTaskIf(task)" class="block-task-third">
                    <strong>{{ task.title }}</strong>
                    <ol>
                        <li v-for="(step, stepIndex) in task.steps" :key="stepIndex">
                        <p class="doneStep" >{{ step.text }}</p>
                    </li>
                    </ol>
                    <b class="text-date">Дата завершения: {{ task.completionDate }}</b>
                </div>
            
        </div>
    `,
    methods: {
        thirdTaskIf(task) {
            let trueDone = task.steps.filter(step => step.done).length;
            let fullLength = task.steps.length;


            if (fullLength === 0) {
                return false;
            }

            if (trueDone == fullLength && !task.completionDate){
                task.completionDate = new Date().toLocaleString()
                this.$emit('update-tasks', this.tasks);
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
        },
        secondTableTasks: {
            type: Number,
            required: true
        }
    },
    template: `
        <div class="task-list">
            <h2>Второй лист</h2>
            
                <div v-for="(task, index) in tasks" :key="index" v-if="secondTaskIf(task)" class="block-task-second">
                    <strong>{{ task.title }}</strong>
                    <ol>
                        <li v-for="(step, stepIndex) in task.steps" :key="stepIndex" >
                            <p v-if="step.done == false" @click="selectStep(step)" :class="{ 'doneStep': step.done, 'pointer': true }">{{ step.text }}</p>
                            <p v-else :class="{ 'doneStep': step.done}">{{ step.text }}</p>
                        </li>     
                    </ol>
                </div>
            
        </div>
    `,
    methods: {
        secondTaskIf(task) {
            let trueDone = task.steps.filter(task => task.done).length;
            let fullLength = task.steps.length;
            let trueTask = 0;

            if (fullLength === 0) {
                return false;
            }


            return (trueDone > fullLength / 2 || trueDone == fullLength / 2) && trueDone < fullLength;
        },
        selectStep(step) {

            step.done = !step.done;
        },
        updateTaskCountSecond() {
            this.$emit('update-count', this.tasks.filter(task => this.secondTaskIf(task)).length);
        }
    },
    watch: {
        tasks: {
            handler(newTasks) {
                localStorage.setItem("tasks", JSON.stringify(newTasks));
                this.updateTaskCountSecond()
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
        },
        firstTableTasks: {
            type: Number,
            required: true
        },
        secondTableTasks: {
            type: Number,
            required: true
        }
    },
    template: `
        <div class="task-list">
            <h2>Первый лист</h2>
            
            <div v-for="(task, index) in tasks" :key="index" v-if="firstTaskIf(task)" class="block-task-first">
                <strong>{{ task.title }}</strong>
                <ol>
                    <li v-for="(step, stepIndex) in task.steps" :key="stepIndex">
                        <p @click="selectStep(step)" :class="{ 'doneStep': step.done, 'pointer': true }" >{{ step.text }}</p>
                    </li>
                </ol>
            </div>
        </div>
    `,
    methods: {
        firstTaskIf(task) {
            let trueDone = task.steps.filter(step => step.done).length;
            let fullLength = task.steps.length;
            return trueDone < fullLength / 2;
        },
        selectStep(step) {
            step.done = !step.done;
        },
        updateTaskCount() {
            this.$emit('update-count', this.tasks.filter(task => this.firstTaskIf(task)).length);
        }
    },
    watch: {
        tasks: {
            handler(newTasks) {
                localStorage.setItem("tasks", JSON.stringify(newTasks));
                this.updateTaskCount();
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
        let firstTableTasks = 0
        if (localStorage.getItem("firstTableTasks")){
            firstTableTasks = localStorage.getItem("firstTableTasks")
        }
        let secondTableTasks = 0
        if (localStorage.getItem("secondTableTasks")){
            secondTableTasks = localStorage.getItem("secondTableTasks")
        }
        return {
            tasks: tasks,
            firstTableTasks: firstTableTasks,
            secondTableTasks: secondTableTasks
        };
    },
    methods: {
        updateCount(count) {
            this.firstTableTasks = count;
            localStorage.setItem("firstTableTasks", this.firstTableTasks);
        },
        updateCountSecond(count){
            this.secondTableTasks = count;
            localStorage.setItem("secondTableTasks", this.secondTableTasks);
        },
        addTask(task) {
            this.tasks.push(task);
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        }
    },
    template: `
        <div>
            <create-task @task-created="addTask" :firstTableTasks="firstTableTasks" ></create-task>
            <div class="tasks-table">
                <first-task-list :tasks="tasks" :secondTableTasks="secondTableTasks" :firstTableTasks="firstTableTasks" @update-count="updateCount" class="color-table-orange"></first-task-list>
                <second-task-list :tasks="tasks" :secondTableTasks="secondTableTasks" class="color-table-aqua" @update-count="updateCountSecond" ></second-task-list>
                <third-task-list :tasks="tasks" class="color-table-green"></third-task-list>
            </div>
            
        </div>
    `
});
