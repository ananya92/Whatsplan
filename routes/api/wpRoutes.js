const router = require("express").Router();
const controller = require("../../controllers/controller");
const Plan = require("../../models/plan");

// Matches with "/api/wp"
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
module.exports = router;

