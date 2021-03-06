var tp = require('./lforms_testpage.po.js');

function waitForDisplayed(ele) {
  browser.wait(function() {
    return ele.isDisplayed().then(null, function(err) {
      // Probably a stale element reference.  Get a new promise.
      console.log("Got error on isDisplayed(); refreshing element promise");
      ele = element(ele.locator());
      return ele.isDisplayed();
    });
  }, tp.WAIT_TIMEOUT_1);
}

function waitForNotPresent(ele) {
  browser.wait(function() {
    return ele.isPresent().then(function(result){return !result});
  }, tp.WAIT_TIMEOUT_1);
}

describe('popover buttons', function() {
  // copyright
  describe('Copyright popover message', function() {

    var formCopyright = element(by.css('div[content="A Copyright notice of the form"]'));
    var itemCopyright = element(by.css('div[content="A Copyright notice of the item"]'));

    it('should show a copyright popover message on the form title', function () {
      tp.openFullFeaturedForm();
      browser.wait(function() {
        return element(by.id('/type0/1')).isPresent();
      }, tp.WAIT_TIMEOUT_1);
      element(by.id("copyright-all-in-one")).click();
      expect(formCopyright.isDisplayed()).toBe(true);
    });

    it('should show a copyright popover message on an item', function () {
      element(by.id("copyright-/type0/1")).click();
      browser.wait(function() {
        return itemCopyright.isPresent();
      }, tp.WAIT_TIMEOUT_1);
      expect(itemCopyright.isDisplayed()).toBe(true);
    });
  });

  // coding instructions
  describe('coding instructions help message', function() {

    var popover = element(by.css('.lf-de-label .popover-content'));
    var popverHTMLLink1 = element(by.css('a[href="http://lforms-demo1.nlm.nih.gov"]'));
    var popverHTMLLink2 = element(by.css('a[href="http://lforms-demo2.nlm.nih.gov"]'));
    var popverHTMLLink3 = element(by.css('a[href="http://lforms-demo3.nlm.nih.gov"]'));

    var codeCheckbox = tp.checkboxesFinder.get(1);

    var inline1 = element.all(by.css('.lf-de-label span[ng-switch-when="inline-escaped"]')).get(1);
    var inline2 = element.all(by.css('.lf-de-label span[ng-switch-when="inline-escaped"]')).get(2);
    var inline3a = element.all(by.css('.lf-de-label span[ng-switch-when="inline-html"]')).get(0);
    var inline3b = element.all(by.css('.lf-de-label span[ng-switch-when="inline-escaped"]')).get(3);

    var inlineHTMLLink1 = inline1.element(by.css('a[href="http://lforms-demo1.nlm.nih.gov"]'));
    var inlineHTMLLink2 = inline2.element(by.css('a[href="http://lforms-demo2.nlm.nih.gov"]'));
    var inlineHTMLLink3a = inline3a.element(by.css('a[href="http://lforms-demo3.nlm.nih.gov"]'));
    var inlineHTMLLink3b = inline3b.element(by.css('a[href="http://lforms-demo3.nlm.nih.gov"]'));
    var helpButton0 = element(by.id("helpButton-/type0/1")); // text formatted content, no 'codingInstructionsFormat'
    var helpButton1 = element(by.id("helpButton-/type1/1")); // html formatted content, no 'codingInstructionsFormat'
    var helpButton2 = element(by.id("helpButton-/type2/1")); // html formatted content, 'codingInstructionsFormat' is 'text'
    var helpButton3 = element(by.id("helpButton-/type3/1")); // html formatted content, 'codingInstructionsFormat' is 'html'

    var field1 = element(by.id("/type0/1"));

    it('should have HTML and/or TEXT content when templateOptions.allowHTMLInInstructions is true', function () {

      tp.openFullFeaturedForm();

      // popover
      expect(helpButton0.isDisplayed()).toBe(true);
      expect(helpButton1.isDisplayed()).toBe(true);
      expect(helpButton2.isDisplayed()).toBe(true);
      expect(helpButton3.isDisplayed()).toBe(true);

      helpButton0.click();
      expect(popover.isDisplayed()).toBe(true);
      expect(popover.getText()).toBe( "simple text instructions");

      field1.click();
      waitForNotPresent(popover);

      helpButton1.click();
      waitForDisplayed(popover);
      expect(popover.isDisplayed()).toBe(true);
      expect(popverHTMLLink1.isPresent()).toBe(false);
      expect(popover.getText()).toBe("<code>HTML</code> instructions, with a <button>button</button> and a link <a href='http://lforms-demo1.nlm.nih.gov'>LForms Demo 1</a>");

      field1.click();
      waitForNotPresent(popover);
      helpButton2.click();
      waitForDisplayed(popover);
      expect(popover.isDisplayed()).toBe(true);
      expect(popverHTMLLink2.isPresent()).toBe(false);
      expect(popover.getText()).toBe("<code>HTML</code> instructions, with a <button>button</button> and a link <a href='http://lforms-demo2.nlm.nih.gov'>LForms Demo 2</a>");

      field1.click();
      waitForNotPresent(popover);
      helpButton3.click();
      waitForDisplayed(popover);
      expect(popover.isDisplayed()).toBe(true);
      expect(popverHTMLLink3.isDisplayed()).toBe(true);

      // inline
      codeCheckbox.click();
      expect(inline1.isDisplayed()).toBe(true);
      expect(inlineHTMLLink1.isPresent()).toBe(false);

      expect(inline2.isDisplayed()).toBe(true);
      expect(inlineHTMLLink2.isPresent()).toBe(false);

      expect(inline3a.isDisplayed()).toBe(true);
      expect(inlineHTMLLink3a.isDisplayed()).toBe(true);


    });

    it('should have only escaped TEXT content when templateOptions.allowHTMLInInstructions is false', function () {

      tp.openFullFeaturedForm();

      element(by.id("change-option")).click();

      // popover
      expect(helpButton0.isDisplayed()).toBe(true);
      expect(helpButton1.isDisplayed()).toBe(true);
      expect(helpButton2.isDisplayed()).toBe(true);
      expect(helpButton3.isDisplayed()).toBe(true);

      helpButton0.click();
      waitForDisplayed(popover);
      expect(popover.isDisplayed()).toBe(true);
      expect(popover.getText()).toBe( "simple text instructions");

      field1.click();
      waitForNotPresent(popover);
      helpButton1.click();
      waitForDisplayed(popover);
      expect(popover.isDisplayed()).toBe(true);
      expect(popverHTMLLink1.isPresent()).toBe(false);
      expect(popover.getText()).toBe("<code>HTML</code> instructions, with a <button>button</button> and a link <a href='http://lforms-demo1.nlm.nih.gov'>LForms Demo 1</a>");

      field1.click();
      waitForNotPresent(popover);
      helpButton2.click();
      waitForDisplayed(popover);
      expect(popover.isDisplayed()).toBe(true);
      expect(popverHTMLLink2.isPresent()).toBe(false);
      expect(popover.getText()).toBe("<code>HTML</code> instructions, with a <button>button</button> and a link <a href='http://lforms-demo2.nlm.nih.gov'>LForms Demo 2</a>");

      field1.click();
      waitForNotPresent(popover);
      helpButton3.click();
      waitForDisplayed(popover);
      expect(popover.isDisplayed()).toBe(true);
      expect(popover.getText()).toBe("<code>HTML</code> instructions, with a <button>button</button> and a link <a href='http://lforms-demo3.nlm.nih.gov'>LForms Demo 3</a>");

      // inline
      codeCheckbox.click();
      expect(inline1.isDisplayed()).toBe(true);
      expect(inlineHTMLLink1.isPresent()).toBe(false);

      expect(inline2.isDisplayed()).toBe(true);
      expect(inlineHTMLLink2.isPresent()).toBe(false);

      expect(inline3b.isDisplayed()).toBe(true);
      expect(inlineHTMLLink3b.isPresent()).toBe(false);


    });

    it('should be display HTML/Text formatted coding instructions from FHIR R4 Questionnaire', function() {
      tp.loadFromTestData('ussg-fhp.json', 'R4');


      var nameHelpButton = element(by.id("helpButton-/54126-8/54125-0/1/1"));
      var genderHelpButton = element(by.id("helpButton-/54126-8/54131-8/1/1"));
      var gender = element(by.id("/54126-8/54131-8/1/1"));
      var popverHTMLLink = element(by.css('a[href="http://google.com"]'));

      waitForDisplayed(nameHelpButton);
      expect(nameHelpButton.isDisplayed()).toBe(true);
      expect(genderHelpButton.isDisplayed()).toBe(true);

      // HTML formatted coding instructions
      nameHelpButton.click();
      waitForDisplayed(popover);
      expect(popover.isDisplayed()).toBe(true);
      expect(popverHTMLLink.isDisplayed()).toBe(true);

      gender.click()

      // Text coding instructions
      genderHelpButton.click();
      popover = element(by.css('.lf-de-label .popover-content')); // refresh
      waitForDisplayed(popover);
      expect(popover.isDisplayed()).toBe(true);
      expect(popverHTMLLink.isPresent()).toBe(false);

    });

  });
});
