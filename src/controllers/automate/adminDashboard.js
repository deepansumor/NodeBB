"use strict";
const _ = require('lodash');
const nconf = require('nconf');
const categories = require('../../categories');
const meta = require('../../meta');
const privileges = require('../../privileges');
const adminDashboardController = module.exports;

adminDashboardController.get = async function (req, res) {


    const allRootCids = await categories.getAllCidsFromSet('cid:0:children');
    const rootCids = await privileges.categories.filterCids('find', allRootCids, req.uid);
    const pageCount = Math.max(1, Math.ceil(rootCids.length / meta.config.categoriesPerPage));
    const page = Math.min(parseInt(req.query.page, 10) || 1, pageCount);
    const start = Math.max(0, (page - 1) * meta.config.categoriesPerPage);
    const stop = start + meta.config.categoriesPerPage - 1;
    const pageCids = rootCids.slice(start, stop + 1);

    const allChildCids = _.flatten(await Promise.all(pageCids.map(categories.getChildrenCids)));
    const childCids = await privileges.categories.filterCids('find', allChildCids, req.uid);
    const categoryData = await categories.getCategories(pageCids.concat(childCids));
    const tree = categories.getTree(categoryData, 0);

    const data = {
        title: "Overview",
        categories:tree
    }

    res.render("automate/adminDashboard", data);
};