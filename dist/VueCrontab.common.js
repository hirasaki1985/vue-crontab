/*!
  * VueCrontab v0.0.1
  * (c) 2019 Mamoru Hirasaki
  * @license MIT
  */
'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function install(_vue) {
    // console.log('install()')
    // console.log(this.options)
    _vue.mixin({
        created: function () {
            // console.log('install created()')
        },
        updated: function () {
            // console.log('install updated()')
        },
    });
    _vue.prototype.$crontab = VueCrontab.getInstance();
}

/**
 * Class that records the execution result of VueCrontab.
 */
class VueCrontabRecord {
    /**
     * constructor with option.
     * @param {Object} option
     * @param {number} [options.max_rec_num=1] Maximum number of records to record execution results.
     */
    constructor(option = {}) {
        this.initialize(option);
    }
    /**
     * initialize
     * @param {Object} option
     */
    initialize(option = {}) {
        this.results = [];
        this.max_rec_num = option['max_rec_num'] || 1;
        this.counter = 0;
    }
    /**
     * Add the execution result of VueCrontab.
     * @param {Date} match_date execution time of VueCrontab.
     * @param {any} result result execution of VueCrontab.
     * @param {Date} finish_date Time when job ended
     * @return {number} return new length of array.
     */
    addResult(match_date, result, type = 'cron', finish_date = new Date()) {
        // delete result
        if (this.results.length >= this.max_rec_num) {
            this.deleteFirstResult();
        }
        // add result
        this.counter++;
        const add_result = {
            match_date: match_date,
            result: result,
            type: type,
            finish_date: finish_date
        };
        return this.results.push(add_result);
    }
    /**
     * Delete the first execution result.
     * @return {Object} delete execution.
     */
    deleteFirstResult() {
        if (this.results.length === 0)
            return {};
        return this.results.shift();
    }
    /**
     * Return the execution latest result of crontab
     * @return {Object} last result.
     */
    getLastResult() {
        if (this.results.length === 0) {
            return {};
        }
        return this.results[this.results.length - 1];
    }
    /**
     * Returns the execution result of crontab
     * @return Array<Object>
     */
    getResults() {
        return this.results;
    }
}

class Crontab {
    /**
     * Convert format of crontab written in string to Object format.
     * @param {String} crontab_str [milliseconds] [seconds] [minutes] [hours] [day] [month] [year] [week of the day]
     * @return {Object} object format.
     *  {
     *    milliseconds: [milliseconds],
     *    seconds: [seconds],
     *    minutes: [minutes],
     *    hours: [hours],
     *    day: [day],
     *    month: [month],
     *    year: [year],
     *    week: [week of the day]
     *  }
     */
    static stringToObject(crontab_str) {
        if (typeof (crontab_str) === 'string') {
            let result = {};
            const crontab_sep = crontab_str.split(' ');
            for (let i in this.settings) {
                const key = this.settings[i]['name'];
                const value = crontab_sep[i] !== undefined ? crontab_sep[i] : '*';
                result[key] = value;
            }
            return result;
        }
        return crontab_str;
    }
    /**
     * Converts date and time type to Object format.
     * month is incrementing by 1. milliseconds is in 0.1 second increments.
     * @param {Date} date convert date.
     * @return {Object} date object.
     */
    static convertDateToObject(date) {
        return {
            milliseconds: Math.floor(date.getMilliseconds() / this.milliseconds_increments),
            seconds: date.getSeconds(),
            minutes: date.getMinutes(),
            hours: date.getHours(),
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            week: date.getDay()
        };
    }
    /**
     * Fill in the unset points with the default value.
     * @param {Object} interval
     * @return {Object}
     */
    static fillUnsetDefaultValue(interval) {
        let obj = Object.assign({}, interval);
        for (let i in this.settings) {
            let key = this.settings[i]['name'];
            obj[key] = interval[key] === undefined ? this.settings[i]['default'] : interval[key];
        }
        return obj;
    }
    /**
     * Check whether interval setting of crontab matches specified date and time.
     * @param {String|Object} interval crontab format string or object
     *   [milliseconds] [seconds] [minutes] [hours] [day] [month] [year] [week of the day]
     * @param {Date} check_date Date and time of comparison
     * @return {Boolean} true = match, false = not match.
     */
    static isMatch(interval, check_date) {
        const date_obj = this.convertDateToObject(check_date);
        let interval_obj = null;
        if (typeof (interval) === 'string') {
            interval_obj = this.stringToObject(interval);
        }
        else {
            interval_obj = this.fillUnsetDefaultValue(interval);
        }
        for (const part in this.settings) {
            const name = this.settings[part]['name'];
            const part_str = interval_obj[name];
            const time_num = date_obj[name];
            const result = this.isMatchPart(part_str, time_num);
            if (result === true)
                continue;
            return false;
        }
        return true;
    }
    /**
     * Make sure to match one item on crontab.
     * @param {String} part one item on crontab.
     * @param {number} time Part of the date or time to be compared.
     * @return {Boolean} true = match, false = not match
     * @throws {format errors}
     */
    static isMatchPart(part, time) {
        if (part === '*') {
            return true;
        }
        // comma separate array
        const comma_sep = part.split(',');
        // find comma character.
        if (comma_sep.length > 1) {
            if (comma_sep.indexOf('') >= 0) {
                throw new Error('comma format error.');
            }
            for (const comma_part in comma_sep) {
                const target = comma_sep[comma_part];
                const match_result = this.isMatchPartOne(target, time);
                if (match_result)
                    return true;
            }
            return false;
        }
        // check single
        return this.isMatchPartOne(part, time);
    }
    /**
     * check match one item. after split comma.
     * @param {String} chk_str check fotmat.
     * @param {number} time compare of number.
     * @return {Boolean} true = match, false = not match.
     */
    static isMatchPartOne(chk_str, time) {
        // slash
        const slash_result = this.isMatchSlash(chk_str, time);
        if (slash_result !== 0) {
            return slash_result === 1 ? true : false;
        }
        // hyphen
        const hyphen_result = this.isMatchHyphen(chk_str, time);
        if (hyphen_result !== 0) {
            return hyphen_result === 1 ? true : false;
        }
        // number
        if (isNaN(Number(chk_str)))
            throw new Error('number format error.');
        if (Number(chk_str) === time)
            return true;
        return false;
    }
    /**
     * Check the time matches the setting of slash.
     * @param {String} chk_str
     * @param {number} time
     * @return {number} 0 = don't check, 1 = ok, -1 = ng.
     */
    static isMatchSlash(chk_str, time) {
        const slash_sep = chk_str.split('/');
        // check slash
        if (slash_sep.length === 2) {
            const s_num = Number(slash_sep[1]);
            if (isNaN(s_num) || isNaN(time) || s_num === 0)
                return -1;
            if (time % s_num === 0)
                return 1;
            return -1;
            // format error.
        }
        else if (slash_sep.length > 2) {
            throw new Error('slash format error.');
        }
        return 0;
    }
    /**
     * Check the time matches the setting of hyphen.
     * @param {String} chk_str check str.
     * @param {numbetr} time check the time.
     * @return {number} 0 = don't check, 1 = ok, -1 = ng.
     */
    static isMatchHyphen(chk_str, time) {
        const hyphen_sep = chk_str.split('-');
        // check hyphen
        if (hyphen_sep.length === 2) {
            const before = hyphen_sep[0] === '' ? null : Number(hyphen_sep[0]);
            const after = hyphen_sep[1] === '' ? null : Number(hyphen_sep[1]);
            if ((isNaN(before) || before === null) && time <= after)
                return 1;
            if ((isNaN(after) || after === null) && time >= before)
                return 1;
            if ((isNaN(before) || before === null) && (isNaN(after) || after === null))
                return -1;
            if (before <= time && time <= after)
                return 1;
            return -1;
            // format error.
        }
        else if (hyphen_sep.length > 2) {
            throw new Error('hyphen format error.');
        }
        return 0;
    }
    /**
     * check crontab format.
     * @param {String|Object} interval crontab format string or object.
     * @return {Boolean} true = ok, false - ng.
     */
    static validateInterval(interval) {
        let check_obj = null;
        if (typeof (interval) === 'string') {
            if (interval === '')
                return false;
            check_obj = this.stringToObject(interval);
        }
        else {
            if (Object.keys(interval).length === 0)
                return false;
            check_obj = interval;
        }
        check_obj = this.fillUnsetDefaultValue(check_obj);
        for (let i in this.settings) {
            let interval_name = this.settings[i]['name'];
            let target = check_obj[interval_name];
            let result = this.validateIntervalPart(target, this.settings[i]['validate']);
            if (!result) {
                return false;
            }
        }
        return true;
    }
    /**
     * check format one item on crontab.
     * @param {String} part item on crontab.
     * @param {Object} validate validate rules.
     * @return {Boolean} true = ok, false = ng.
     */
    static validateIntervalPart(part, validate = {}) {
        if (part === '') {
            return false;
        }
        // comma separate array
        const comma_sep = part.split(',');
        // multi
        if (comma_sep.length > 1) {
            for (let i in comma_sep) {
                let target = comma_sep[i];
                if (!this.checkIntervalPiece(target, validate)) {
                    return false;
                }
            }
            // single
        }
        else {
            if (!this.checkIntervalPiece(part, validate)) {
                return false;
            }
        }
        return true;
    }
    /**
     * check interval format. after split comma.
     * @param {String} chk_str check str.
     * @param {Object} rule validation rule.
     * @return {Boolean} true = ok, false = ng.
     */
    static checkIntervalPiece(chk_str, rule = {}) {
        if (chk_str === '*')
            return true;
        let slash_result = this.checkSlash(chk_str);
        if (slash_result !== 0) {
            return slash_result === 1 ? true : false;
        }
        let hyphen_result = this.checkHyphen(chk_str, rule);
        if (hyphen_result !== 0) {
            return hyphen_result === 1 ? true : false;
        }
        if (!this.checkNum(chk_str))
            return false;
        return this.checkRange(chk_str, rule);
    }
    /**
     * check slash format.
     * @param {String} chk_str check str.
     * @return {number} 0 = don't check, 1 = ok, -1 = ng.
     */
    static checkSlash(chk_str) {
        const slash_sep = chk_str.split('/');
        if (slash_sep.length === 1)
            return 0;
        if (slash_sep.length >= 3)
            return -1;
        if (slash_sep[0] !== '')
            return -1;
        if (isNaN(Number(slash_sep[1])))
            return -1;
        return 1;
    }
    /**
     * check hyphen format.
     * @param {String} chk_str check str.
     * @param {Object} rule validation rule.
     * @return {number} 0 = don't check, 1 = ok, -1 = ng.
     */
    static checkHyphen(chk_str, rule = {}) {
        const hyphen_sep = chk_str.split('-');
        if (hyphen_sep.length === 1)
            return 0;
        if (hyphen_sep.length >= 3)
            return -1;
        let start = Number(hyphen_sep[0]);
        let end = Number(hyphen_sep[1]);
        if (hyphen_sep[0] === '') {
            if (isNaN(end))
                return -1;
            return this.checkRange(hyphen_sep[1], rule) ? 1 : -1;
        }
        else if (hyphen_sep[1] === '') {
            if (isNaN(start))
                return -1;
            return this.checkRange(hyphen_sep[0], rule) ? 1 : -1;
        }
        else {
            if (isNaN(start) || isNaN(end))
                return -1;
            if (!this.checkRange(hyphen_sep[0], rule))
                return -1;
            if (!this.checkRange(hyphen_sep[1], rule))
                return -1;
            if (start > end)
                return -1;
        }
        return 1;
    }
    /**
     * check number format.
     * @param {String} chk_str check str.
     * @return {Boolean} true = ok, false = ng.
     */
    static checkNum(chk_str) {
        if (chk_str === '')
            return false;
        if (isNaN(Number(chk_str)))
            return false;
        return true;
    }
    /**
     * check number out of range.
     * @param {String} chk_str check str.
     * @param {Object} validate validate rule.
     * @return {Boolean} true = ok, false = ng.
     */
    static checkRange(chk_str, validate = {}) {
        let num = Number(chk_str);
        // start <= num <= end
        if (typeof (validate['start']) !== 'undefined' && typeof (validate['end']) !== 'undefined') {
            if (validate['start'] <= num && num <= validate['end'])
                return true;
            return false;
            // start <= num
        }
        else if (typeof (validate['start']) !== 'undefined') {
            if (validate['start'] <= num)
                return true;
            return false;
            // num <= end
        }
        else if (typeof (validate['end']) !== 'undefined') {
            if (num <= validate['end'])
                return true;
            return false;
        }
        return true;
    }
}
/** keys of interval setting. */
Crontab.settings = [
    { name: 'milliseconds',
        validate: { start: 0, end: 9 },
        default: '*' },
    { name: 'seconds',
        validate: { start: 0, end: 59 },
        default: '*' },
    { name: 'minutes',
        validate: { start: 0, end: 59 },
        default: '*' },
    { name: 'hours',
        validate: { start: 0, end: 23 },
        default: '*' },
    { name: 'day',
        validate: { start: 1, end: 31 },
        default: '*' },
    { name: 'month',
        validate: { start: 1, end: 12 },
        default: '*' },
    { name: 'year',
        validate: { start: 0 },
        default: '*' },
    { name: 'week',
        validate: { start: 0, end: 6 },
        default: '*' }
];
/** milliseconds is in 0.1 second increments. */
Crontab.milliseconds_increments = 100;

/**
 * Manage crontab job settings and execution results
 */
class VueCrontabJob {
    /**
     * constructor
     * @param {Object} setting equal private setting: Object.
     * @throws {format errors}
     */
    constructor(setting = {}) {
        this.initialize(setting);
        this.reflectSetting(setting);
    }
    /**
     * Initialize VueCrontabJob setting.
     * @param {Object} setting
     */
    initialize(setting = {}) {
        this.setting = setting;
        this.record = [];
        this.counter = 0;
        this.last_check = null;
        this.last_run = undefined;
        this.state = {
            status: Number(setting['status']) || 1,
            execution: 0,
            sync: Number(setting['sync']) || 0,
        };
        this.jobs = [];
        this.intervals = [];
        this.conditions = [];
    }
    /**
     * set Crontabjob
     * @param setting
     * @throws {format errors}
     */
    reflectSetting(setting) {
        // validate
        let validate_result = VueCrontabJob.validate(setting);
        // catch error.
        if (validate_result !== 1) {
            switch (validate_result) {
                case -1:
                    throw new Error('name format error.');
                case -2:
                    throw new Error('job format error.');
                case -3:
                    throw new Error('interval format error.');
                case -5:
                    throw new Error('condition format error.');
                default:
                    throw new Error('unexpected error.');
            }
            // add job, interval
        }
        else {
            if (this.addJob(setting['job'], setting) === -1) {
                throw new Error('add job error.');
            }
            if (this.addInterval(setting['interval']) === -1) {
                throw new Error('add interval error.');
            }
            if (setting['condition'] && this.addCondition(setting['condition']) === -1) {
                throw new Error('add condition error.');
            }
        }
    }
    /**
     * add job.
     * @param {Array<Function>|Function} job
     * @return {number} add count. -1 = error.
     */
    addJob(job, setting) {
        // Array
        if (Array.isArray(job)) {
            // this.jobs = this.jobs.concat(job)
            for (let i in job) {
                this.jobs.push(job[i]);
                this.record.push(new VueCrontabRecord(setting));
            }
            return job.length;
            // function
        }
        else if (typeof (job) === 'function') {
            this.jobs.push(job);
            this.record.push(new VueCrontabRecord(setting));
            return 1;
        }
        return -1;
    }
    /**
     * add interval.
     * @param {Array<Object | String> | Object | String} interval
     * @return {number} add count. -1 = error.
     */
    addInterval(interval) {
        const types = ['string', 'object'];
        // Array
        if (Array.isArray(interval)) {
            for (let i in interval) {
                let target = interval[i];
                if (!Crontab.validateInterval(target))
                    return -1;
                let add = Crontab.fillUnsetDefaultValue(Crontab.stringToObject(target));
                this.intervals.push(add);
            }
            // this.intervals = this.intervals.concat(interval)
            return interval.length;
            // string or object
        }
        else if (types.indexOf(typeof (interval)) >= 0) {
            if (!Crontab.validateInterval(interval))
                return -1;
            let add = Crontab.fillUnsetDefaultValue(Crontab.stringToObject(interval));
            this.intervals.push(add);
            return 1;
        }
        else {
            return -1;
        }
    }
    /**
     * add condition.
     * @param {Array<Function>|Function} condition
     * @return {number} add count. -1 = error.
     */
    addCondition(condition) {
        // Array
        if (Array.isArray(condition)) {
            for (let i in condition) {
                this.conditions.push(condition[i]);
            }
            return condition.length;
            // function
        }
        else if (typeof (condition) === 'function') {
            this.conditions.push(condition);
            return 1;
        }
        return -1;
    }
    /**
     * execute job.
     * @param {Date} date check date.
     * @return {Object}
     *  {
     *    {number} code: 1 = run, 0 = date not match interval, -1 = stop job execution, -2 = condition is not true.
     *    {Date}   date: execute date.
     *  }
     */
    execute(date) {
        return __awaiter(this, void 0, void 0, function* () {
            this.last_check = date;
            let code = 1;
            // check state
            if (this.state['status'] !== 1) {
                code = -1;
            }
            else {
                // check intervals
                for (let i in this.intervals) {
                    let interval = this.intervals[i];
                    // not match
                    if (!Crontab.isMatch(interval, date)) {
                        code = 0;
                        break;
                    }
                }
                // check conditions
                for (let j in this.conditions) {
                    let condition = this.conditions[j];
                    // not true
                    if (!condition()) {
                        code = -2;
                        break;
                    }
                }
                if (code === 1)
                    code = yield this.run(date);
            }
            return {
                code: code,
                date: date
            };
        });
    }
    /**
     * manual execute.
     * @return {Object} {
     *    {number} code: 1 = run.
     *    {Date}   date: execute date.
     *  }
     */
    manualExecute() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            let result = yield this.run(now, 'manual');
            return {
                code: result,
                date: now
            };
        });
    }
    /**
     * run job.
     * @param {Date} date
     * @param {String} type
     * @return {number} code: 1 = run, 0 = date not match interval, -1 = stop job execution.
     */
    run(date = new Date(), type = 'cron') {
        return __awaiter(this, void 0, void 0, function* () {
            // execute jobs
            let self = this;
            let j = null;
            let num = null;
            let arg = null;
            for (j in this.jobs) {
                try {
                    num = Number(j);
                    arg = this.getJobArguments(num, date);
                    function syncExecution() {
                        return new Promise((resolve, reject) => {
                            setTimeout(function () {
                                return __awaiter(this, void 0, void 0, function* () {
                                    let result = yield self.jobs[j](arg);
                                    let set_result = self.setResult(num, date, result, type);
                                    resolve();
                                });
                            }, 0);
                        }).catch((error) => console.error(error));
                    }
                    if (self.setting['sync'] === 1) {
                        yield syncExecution();
                    }
                    else {
                        syncExecution();
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
            // update last run
            this.last_run = date;
            return 1;
        });
    }
    /**
     * Make the job executable.
     */
    start() {
        this.state['status'] = 1;
    }
    /**
     * Make the job not executable.
     */
    stop() {
        this.state['status'] = 0;
    }
    /**
     * Check whether job setting is OK.
     * @param {Object} setting  job
     * @return {number} 1 = OK. -1 = name error. -2 = job error. -3 = interval error. -4 = emtpy. -5 = condition error.
     */
    static validate(setting) {
        if (Object.keys(setting).length === 0 && setting.constructor === Object) {
            return -4;
        }
        // check name.
        let name = setting['name'];
        if (typeof (name) !== 'string' || name === '')
            return -1;
        // check jobs.
        if (!this.validateJobs(setting['job']))
            return -2;
        // check intervals.
        if (!this.validateIntervals(setting['interval']))
            return -3;
        // check condition.
        if (setting['condition'] && !this.validateCondition(setting['condition']))
            return -5;
        return 1;
    }
    /**
     * job validation
     * @param {Array<Function> | Function} job
     * @return {Boolean} true = ok, false = ng.
     */
    static validateJobs(job) {
        const types = ['function'];
        if (typeof (job) !== 'undefined') {
            // multi jobs
            if (Array.isArray(job)) {
                if (job.length === 0)
                    return false;
                for (let i in job) {
                    // validate
                    if (types.indexOf(typeof (job[i])) === -1)
                        return false;
                }
                // single job
            }
            else if (types.indexOf(typeof (job)) === -1)
                return false;
        }
        else {
            return false;
        }
        return true;
    }
    /**
     * job validation
     * @param {Array<Object|String> | Object | String} job
     * @return {Boolean} true = ok, false = ng.
     */
    static validateIntervals(interval) {
        const types = ['string', 'object'];
        // not undefined
        if (typeof (interval) !== 'undefined') {
            // multi intervals
            if (Array.isArray(interval)) {
                if (interval.length === 0)
                    return false;
                for (let i in interval) {
                    // validate
                    if (types.indexOf(typeof (interval[i])) === -1)
                        return false;
                    if (!Crontab.validateInterval(interval[i]))
                        return false;
                }
                // single interval
            }
            else {
                // validate
                if (types.indexOf(typeof (interval)) === -1)
                    return false;
                if (!Crontab.validateInterval(interval))
                    return false;
            }
            return true;
            // undefined
        }
        else {
            return false;
        }
    }
    /**
     * condition validation
     * @param {Array<Function>|Function} condition
     * @return {Boolean} true = ok, false = ng.
     */
    static validateCondition(condition) {
        const types = ['function'];
        if (typeof (condition) !== 'undefined') {
            // multi jobs
            if (Array.isArray(condition)) {
                if (condition.length === 0)
                    return true;
                for (let i in condition) {
                    // validate
                    if (types.indexOf(typeof (condition[i])) === -1)
                        return false;
                }
                // single job
            }
            else if (types.indexOf(typeof (condition)) === -1)
                return false;
        }
        return true;
    }
    /**
     * Return arguments at job execution.
     * @param {number} num this.record index
     * @param {Date} date execution date and time.
     * @return {Object} arguments
     */
    getJobArguments(num = 0, date) {
        if (0 <= num && num < this.record.length) {
            const last_result = this.record[num].getLastResult();
            return {
                exec_date: date,
                last_run: this.last_run,
                counter: this.record[num].counter,
                last_result: last_result['result'],
                type: last_result['type']
            };
        }
        return {};
    }
    /**
     * Add execution result.
     * @param {number} num this.record index
     * @param {Date} match_date
     * @param {any} result execution result(job function return).
     * @param {String} type crontab or manual
     * @param {Date} finish_date Time when job ended
     * @return {Boolean} true = success. false = failed.
     */
    setResult(num, match_date, result, type = 'cron', finish_date = new Date()) {
        if (0 <= num && num < this.record.length) {
            this.last_run = match_date;
            this.counter++;
            this.record[num].addResult(match_date, result, type, finish_date);
            return true;
        }
        return false;
    }
    /**
     * Return latest execution result.
     * @param {number} num this.record index
     * @return {Object} last result.
     */
    getLatestResult(num = 0) {
        if (0 <= num && num < this.record.length) {
            return this.record[num].getLastResult();
        }
        return {};
    }
    /**
     * return state of job.
     * @return Object this.state
     */
    getState() {
        return this.state;
    }
}

class VueCrontabOption {
    constructor(option = {}) {
        this.setOption(option);
    }
    /**
     * set VueCrontab option.
     * @param {Object} option
     */
    setOption(option) {
        this.interval = option['interval'] !== undefined ? option['interval'] : 1000;
        this.auto_start = option['auto_start'] !== undefined ? option['auto_start'] : true;
    }
    /**
     * get interval time of check jobs
     * @return {number} interval time.
     */
    getInterval() {
        return this.interval;
    }
}

class VueCrontab {
    /**
     * constructor
     * @param {Function} caller
     */
    constructor(caller) {
        /**
         * Vue install
         */
        this.install = install;
        if (caller == VueCrontab.getInstance) {
            this.initialize();
        }
        else if (VueCrontab._instance)
            throw new Error('vuecrontab instance already created.');
        else
            throw new Error('instance create error.');
    }
    /**
     * initialize VueCrontab
     * @param {Object} [option={}]
     */
    initialize(option = {}) {
        this.jobs = {};
        this.state = {};
        this.interval_id = null;
        this.state = {};
        this.setOption(option);
    }
    /**
     * set VueCrontab Option
     * @param {Object} option
     */
    setOption(option) {
        this.option = new VueCrontabOption(option);
    }
    /**
     * get VueCrontab Option
     * @return {Object} VueCrontab option.
     */
    getOption() {
        return this.option;
    }
    /**
     * start all jobs interval check.
     * @return {number} 1 = start success. 2 = already start. 0 = no job.
     */
    startCrontab() {
        // check already start.
        if (this.interval_id !== null) {
            return 2;
        }
        // check job length.
        if (Object.keys(this.jobs).length === 0) {
            return 0;
        }
        // Adjust the value of millesconds in the vicinity of 050
        let milleseconds = 0;
        do {
            let date = new Date();
            milleseconds = date.getMilliseconds();
        } while (!(40 <= milleseconds && milleseconds <= 60));
        // start
        let self = this;
        this.interval_id = setInterval(function () {
            let now = new Date();
            for (const job in self.jobs) {
                let target_job = self.jobs[job];
                target_job.execute(now);
            }
        }, this.option.getInterval());
        return 1;
    }
    /**
     * stop all jobs interval check.
     */
    stopCrontab() {
        clearInterval(this.interval_id);
    }
    /**
     * enable job.
     * @param {string} name
     * @return {Boolean}
     */
    enableJob(name) {
        if (this.getJob(name) !== null) {
            this.jobs[name].start();
            return true;
        }
        return false;
    }
    /**
     * disable job.
     * @param {string} name
     * @return {Boolean}
     */
    disableJob(name) {
        if (this.getJob(name) !== null) {
            this.jobs[name].stop();
            return true;
        }
        return false;
    }
    /**
     * add job.
     * @param {Array<Object>|Object} config
     * @return {number} Number of registrations.
     */
    addJob(config) {
        let count = 0;
        // format of array
        if (Array.isArray(config)) {
            for (let i in config) {
                let target = config[i];
                // validate
                let validate_result = VueCrontabJob.validate(target);
                if (validate_result === 1) {
                    let name = target['name'];
                    if (this.isDuplicateJob(name))
                        continue;
                    // add
                    let obj = new VueCrontabJob(target);
                    this.jobs[name] = obj;
                    count++;
                }
            }
            // format of object
        }
        else if (typeof (config) === 'object') {
            // validate
            let validate_result = VueCrontabJob.validate(config);
            if (validate_result === 1) {
                let name = config['name'];
                if (this.isDuplicateJob(name))
                    return 0;
                // add
                let obj = new VueCrontabJob(config);
                this.jobs[name] = obj;
                count = 1;
            }
        }
        else {
            return 0;
        }
        if (Object.keys(this.jobs).length > 0 && this.option.auto_start) {
            this.startCrontab();
        }
        return count;
    }
    /**
     * Check whether job name is duplicated.
     * @param {string} name job name.
     * @return {Boolean} true = duplicate, false = not duplicate.
     */
    isDuplicateJob(name) {
        // duplicate check.
        if (this.getJob(name) !== null) {
            return true;
        }
        return false;
    }
    /**
     * delete job.
     * @param {string} name
     */
    deleteJob(name) {
        if (this.getJob(name) !== null) {
            delete this.jobs[name];
            // stop CVrontab if job length is 0.
            if (Object.keys(this.jobs).length === 0) {
                this.stopCrontab();
            }
            return true;
        }
        return false;
    }
    /**
     * Run the job manually.
     * @param {string} name
     * @return {Object} {
     *    {number} code: 1 = run. -2 = no job.
     *    {Date}   date: execute date.
     *  }
     */
    execJob(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            if (this.getJob(name) !== null) {
                let result = yield this.jobs[name].manualExecute();
                return result;
            }
            return {
                code: -2,
                date: now
            };
        });
    }
    /**
     * get job.
     * @param {string} name
     * @return {VueCrontabJob} null = can't find by name.
     */
    getJob(name) {
        return this.jobs[name] || null;
    }
    /**
     * get instance
     * @return {VueCrontab}
     */
    static getInstance() {
        if (!this._instance)
            this._instance = new VueCrontab(VueCrontab.getInstance);
        return this._instance;
    }
}

var index = VueCrontab.getInstance();

module.exports = index;
