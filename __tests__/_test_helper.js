var chai = require('chai');
var sinonChai = require('sinon-chai');
var sinon = require('sinon');

chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;

