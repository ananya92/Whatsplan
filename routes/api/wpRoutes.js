const router = require("express").Router();
const mongoose = require("mongoose");
const Plan = require("../../models/plan");
const Milestone = require("../../models/milestone");
const Task = require("../../models/task");
// Matches with "/api/wp"
//Add new plan
router.post('/plan', (req, res) => {
    console.log('post new plan', req.body);
    const newPlan = {
        title: req.body.title,
        owner: req.body.owner,
        members: req.body.members,
        status: req.body.status
    }
    Plan.create(newPlan, function (err, savedPlan) {
        if (err) return res.json(err);
        res.json(savedPlan);
    });
});
// Add new milestone
router.post('/milestone', (req, res) => {
    console.log('Post new milestone', req.body);
    const newMilestone = {
        milestoneName: req.body.milestoneName,
        deadline: req.body.deadline,
        status: req.body.status
    }
    Milestone.create(newMilestone, function (err, savedMilestone) {
        if (err) return res.json(err);
        res.json(savedMilestone);
    });
});
// Add the milestone ID to the plan
router.put('/addMilestoneToPlan', (req, res) => {
    Plan.findOneAndUpdate({ _id: req.body.plan_id }, { $push: { milestones: req.body.milestone_id } }, (err, plan) => {
        if (err) {
            console.log(err);
        }
        else if (plan) {
            res.json(plan);
        }
        else {
            console.log("No plan exists with id ", req.body.plan_id);
        }
    });
});
//Get plan by ID
router.get('/plan/:id', (req, res) => {
    Plan.findOne({ _id: req.params.id }, (err, plan) => {
        if (err) {
            console.log(err);
        }
        else if (plan) {
            res.json(plan);
        }
        else {
            console.log("No plan exists with id ", req.params.id);
        }
    });
});
//Get milestone by ID
router.get('/milestone/:id', (req, res) => {
    Milestone.findOne({ _id: req.params.id }, (err, milestone) => {
        if (err) {
            console.log(err);
        }
        else if (milestone) {
            res.json(milestone);
        }
        else {
            console.log("No milestone exists with id ", req.params.id);
        }
    });
});

//Get milestone by task ID
router.get('/milestone/task/:taskId', (req, res) => {
    console.log("Reached here");
    Milestone.findOne({ tasks : req.params.taskId }, (err, milestone) => {
        if (err) {
            console.log(err);
        }
        else if (milestone) {
            console.log("Found milestone");
            console.log(milestone);
            res.json(milestone);
        }
        else {
            console.log("No milestone exists which has task id ", req.params.taskId);
        }
    });
});
// Add new task
router.post('/task', (req, res) => {
    console.log('Post new task', req.body);
    const newTask = {
        taskName: req.body.taskName,
        description: req.body.description,
        status: req.body.status,
        asignee: req.body.asignee
    }
    Task.create(newTask, function (err, savedTask) {
        if (err) return res.json(err);
        res.json(savedTask);
    });
});

// Add the task ID to the milestone
router.put('/addTaskToMilestone', (req, res) => {
    Milestone.findOneAndUpdate({ _id: req.body.milestone_id }, { $push: { tasks: req.body.task_id } }, (err, milestone) => {
        if (err) {
            console.log(err);
        }
        else if (milestone) {
            res.json(milestone);
        }
        else {
            console.log("No milestone exists with id ", req.body.milestone_id);
        }
    });
});

//Get task by ID
router.get('/task/:id', (req, res) => {
    Task.findOne({ _id: req.params.id }, (err, task) => {
        if (err) {
            console.log(err);
        }
        else if (task) {
            res.json(task);
        }
        else {
            console.log("No task exists with id ", req.params.id);
        }
    });
});
// Update task by ID
router.put('/task/:id', (req, res) => {
    console.log("reached in put", req.params.id, req.body);
    if(mongoose.Types.ObjectId.isValid(req.params.id)) {
        Task.findOneAndUpdate({_id: req.params.id}, 
            {taskName: req.body.taskName,
            description: req.body.description,
            status: req.body.status,
            asignee: req.body.asignee,
            startDate: req.body.startDate,
            endDate: req.body.endDate}, {new: true}, (err, task) => {
                if (err) {
                    console.log(err);
                }
                else if (task) {
                    res.json(task);
                }
                else {
                    console.log("No task exists with id ", req.params.id);
                }
        });
    }
    else {
        console.log("Invalid id:", req.params.id);
    }
});
module.exports = router;

