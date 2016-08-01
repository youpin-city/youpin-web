const utils = require('../assets/js/lib/util');
const assert = require('chai').assert;


describe('parse_tags', function() {
  it("w/o category tags", function(){
    const str    = "lorem .. sdf #xx #yy";
    const output = utils.parse_tags(str);
    const expect = 'lorem .. sdf <a href="#tags/xx">#xx</a> <a href="#tags/yy">#yy</a>';
    assert.equal( output, expect);
  });

  it("with category tags", function(){
    const str    = "lorem .. sdf #xx #footpath";
    const output = utils.parse_tags(str, [ "footpath" ]);
    const expect = 'lorem .. sdf <a href="#tags/xx">#xx</a>';
    assert.equal( output, expect);
  });

  it("with empty category tags", function(){
    const str    = "lorem .. sdf #xx #footpath";
    const output = utils.parse_tags(str, []);
    const expect = 'lorem .. sdf <a href="#tags/xx">#xx</a> <a href="#tags/footpath">#footpath</a>';
    assert.equal( output, expect);
  });
});
