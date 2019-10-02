const utils = require('../assets/js/lib/util');
const assert = require('chai').assert;


describe('parse_tags', () => {
  it('no duplicate tags', () => {
    const str = 'lorem .. sdf #xx #yy';
    const categoryTags = ['footpath'];
    const output = utils.remove_duplicate_tags(categoryTags, str);
    const expect = categoryTags;
    assert.deepEqual(output, expect);
  });

  it('some categories are in content tags', () => {
    const str = 'lorem .. sdf #xx #footpath';
    const categoryTags = ['footpath', 'city'];
    const output = utils.remove_duplicate_tags(categoryTags, str);
    const expect = ['city'];
    assert.deepEqual(output, expect);
  });

  it('all categories are in content tags', () => {
    const str = 'lorem .. sdf #xx #footpath #city';
    const categoryTags = ['footpath', 'city'];
    const output = utils.remove_duplicate_tags(categoryTags, str);
    const expect = [];
    assert.deepEqual(output, expect);
  });

  it("pin doesn't belong to any category", () => {
    const str = 'lorem .. sdf #xx #footpath #city';
    const categoryTags = [];
    const output = utils.remove_duplicate_tags(categoryTags, str);
    const expect = [];
    assert.deepEqual(output, expect);
  });
});
