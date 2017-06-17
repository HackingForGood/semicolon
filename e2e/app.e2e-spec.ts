import { SemicolonPtcPage } from './app.po';

describe('semicolon-ptc App', () => {
  let page: SemicolonPtcPage;

  beforeEach(() => {
    page = new SemicolonPtcPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
