var tp = require('./lforms_testpage.po.js');
var testUtil = require('./util');

describe('Data Type', function() {

  it('TITLE row should appear', function () {
    tp.openFullFeaturedForm();
    let titleRow = element(by.css(".lf-form-table-row.lf-question.lf-datatype-TITLE.lf-title-row"));
    let typeTitle = titleRow.element(by.css("label[for='/titleHeader/1']"));

    expect(typeTitle.isDisplayed()).toBe(true);
  });

  it('DTM datetime picker should work', function () {
    var minMax = [testUtil.getCurrentDTMString(-60000), testUtil.getCurrentDTMString(+60000)]; // -/+ a minute
    tp.openFullFeaturedForm();
    element(by.css('div.lf-dtm-picker-block > button.ui-datepicker-trigger')).click();
    element(by.css('div.lf-dtm-picker-block ul.datetime-picker-dropdown li span button')).click();
    expect(element(by.id('/type7/1')).getAttribute('value')).toBeGreaterThanOrEqual(minMax[0]);
    expect(element(by.id('/type7/1')).getAttribute('value')).toBeLessThanOrEqual(minMax[1]);
  });

  it('DT data type should work', function () {
    tp.openFullFeaturedForm();
    let dtEl = element(by.id('/type6/1'));
    let otherEl = element(by.id('/type5/1')); // Use for creating blur event

    let dateStr = '02/032019';
    dtEl.clear();
    testUtil.sendKeys(dtEl, dateStr);
    otherEl.click();
    expect(dtEl.getCssValue('border-color')).toEqual('rgb(255, 0, 0)'); // Red border

    dateStr = '02/03/2019';
    dtEl.clear();
    testUtil.sendKeys(dtEl, dateStr);
    otherEl.click();
    expect(dtEl.getAttribute('value')).toEqual(dateStr);
    expect(dtEl.getAttribute('class')).toContain('ng-valid-parse');
  });


  it('DTM data type should work', function () {
    tp.openFullFeaturedForm();
    let dtmEl = element(by.id('/type7/1'));
    dtmEl.clear();
    testUtil.sendKeys(dtmEl, '02/03/201923:59');
    expect(dtmEl.getAttribute('class')).toContain('ng-invalid-parse');

    dtmEl.clear();
    testUtil.sendKeys(dtmEl, '02/03/2019 23:59');
    expect(dtmEl.getAttribute('class')).toContain('ng-valid-datetime');
  });

  describe('Button Type', function() {

    it('Each button should have a type="button" so that ENTER does not submit a form (or trigger ng-click on the buttons)', function () {
      tp.openUSSGFHTHorizontal();

      var name1 = element(by.id('/54126-8/54125-0/1/1')),
          name2 = element(by.id('/54126-8/54125-0/1/2'));

      name1.click();
      name1.sendKeys(protractor.Key.ENTER);
      // nothing should happen
      expect(name2.isPresent()).toBe(false);
    });

  });

  describe("Items with units", function() {

    describe("with a REAL or INT data type", function () {
      beforeAll(() => {tp.openVitalSign()});

      it("should have data type set", function() {
        var field1 = element(by.id('/3140-1/1')),
            field2 = element(by.id('/9279-1/1')),
            field3 = element(by.id('/8310-5/1')); // temperature
        expect(field1.getAttribute('type')).toBe("text");
        field1.evaluate("item.dataType").then(function (value) {
          expect(value).toBe('INT');
        });
        expect(field2.getAttribute('type')).toBe("text");
        field2.evaluate("item.dataType").then(function (value) {
          expect(value).toBe('REAL');
        });
        expect(field3.getAttribute('type')).toBe("text");
        field3.evaluate("item.dataType").then(function (value) {
          expect(value).toBe('REAL');
        });

      });

      it('should show the unit', function() {
        var field3Unit = element(by.id('unit_/8310-5/1')); // temperature
        expect(field3Unit.getAttribute('value')).toBe('Cel');
      });
    });
  });

  describe("Items with QTY dataType", function() {

    it("should render QTY data type with associated units", function() {
      tp.openQTYDemo();
      var field1 = element(by.id('/q1/1')),
          field2 = element(by.id('/q2/1')),
          units1 = element(by.id('unit_/q1/1')),
          units3 = element(by.id('unit_/q3/1')),
          units4 = element(by.id('unit_/q4/1')),
          units5 = element(by.id('unit_/q5/1'));

      expect(field1.getAttribute('type')).toBe("text");
      expect(field1.getAttribute('value')).toBe("2.5");
      field1.evaluate("item.dataType").then(function (value) {
        expect(value).toBe('QTY');
      });
      expect(units1.isPresent()).toBe(false);

      expect(field2.getAttribute('placeholder')).toBe("Type a number");
      expect(field2.getAttribute('value')).toBe("");

      expect(units3.getAttribute("value")).toBe("kgs");

      var ac = tp.Autocomp;
      expect(units4.getAttribute("value")).toBe("lbs");
      units4.evaluate("item.unit").then(function (unit) {
        expect(unit).toEqual({_displayUnit: "lbs", code: "lbs", default: true});
      });
      units4.click();
      units4.sendKeys(protractor.Key.DOWN);
      units4.sendKeys(protractor.Key.ENTER);
      expect(units4.getAttribute("value")).toBe('kilo grams');
      units4.evaluate("item.unit").then(function (unit) {
        expect(unit).toEqual({_displayUnit: "kilo grams", name: "kilo grams", code: "kgs"});
      });
      units4.click();
      // Four units in the list, but one of them is invalid.
      expect(element(by.id('completionOptions')).all(by.css('span ul li')).count()).toBe(3);
      units4.sendKeys(protractor.Key.DOWN);
      units4.sendKeys(protractor.Key.DOWN);
      units4.sendKeys(protractor.Key.DOWN);
      units4.sendKeys(protractor.Key.ENTER);
      expect(units4.getAttribute("value")).toBe('grams');
      units4.evaluate("item.unit").then(function (unit) {
        expect(unit).toEqual({_displayUnit: "grams", name: "grams", system: "http://unitsofmeasure.org"});
      });

      field1.click(); // Close auto complete pull down.
      expect(ac.searchResults.isDisplayed()).toBe(false);
      expect(units5.getAttribute("value")).toBe("");
      units5.click();
      expect(ac.searchResults.isDisplayed()).toBe(true);
    });
  });

  describe('required indicator and aria-required', function () {
    beforeAll(function () {
      tp.openFullFeaturedForm();
    });

    const allFieldTypes = ['dt', 'dtm', 'tx', 'st'];

    allFieldTypes.forEach(function (type) {
      const label = element(by.id(`label-/required_${type}/1`));
      const requiredElement = element(by.id(`/required_${type}/1`));

      it(`should be present for ${type} field`, function () {
        expect(label.getText()).toMatch(/\*$/);  // Ends with required marker
        expect(requiredElement.getAttribute('aria-required')).toBe('true');
      });
    });
  });
});
