const router = require("express").Router();
const controller = require("../../controllers/controller");
const Plan = require("../../models/plan");
const Milestone = require("../../models/milestone");

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
    console.log('post new milestone', req.body);
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
    Plan.findOneAndUpdate({ _id: req.body.plan_id }, {$push: {milestones: req.body.milestone_id}}, (err, plan) => {
      if (err) {
        console.log(err);
      } 
      else if(plan){
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
      else if(plan){
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
          else if(milestone){
            res.json(milestone);
          }
          else {
            console.log("No milestone exists with id ", req.params.id);
          }
        });
      });
module.exports = router;

