import {
  injectAsync, TestComponentBuilder, ComponentFixture,
  beforeEachProviders, beforeEach,
  iit, it, xit,
  describe, ddescribe, xdescribe,
  expect
} from 'angular2/testing';
import {Component, ViewChild} from 'angular2/core';
import {ReactNativeRootRenderer} from '../../../src/renderer/renderer';
import {MockReactNativeWrapper} from "./../../../src/wrapper/wrapper_mock";
import {TabBar} from "../../../src/components/ios/tabbar";
import {TabBarItem} from "../../../src/components/ios/tabbar_item";
import {View} from "../../../src/components/view";
import {fireFunctionalEvent, getTestingProviders} from "../../../src/test_helpers/utils";

var mock: MockReactNativeWrapper = new MockReactNativeWrapper();

describe('TabBar component (iOS)', () => {
  var mock: MockReactNativeWrapper = new MockReactNativeWrapper();
  beforeEach(() => mock.reset());
  beforeEachProviders(() => getTestingProviders(mock, TestComponent));

  it('should render', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<TabBar></TabBar>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-tabbar+{"flex":1},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should render with properties', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<TabBar [accessible]="true" testID="foo" translucent="true"></TabBar>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-tabbar+{"translucent":true,"accessible":true,"testID":"foo","flex":1},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should render with styles', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `<TabBar [styleSheet]="20" [style]="{margin: 42}"></TabBar>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-tabbar+{"flex":1,"collapse":true,"margin":42},ATTACH+1+2+0,ATTACH+2+3+0');
      });
  }));

  it('should render with items', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `
    <TabBar>
      <TabBarItem selected="true"><View [style]="{margin: 1}"></View></TabBarItem>
      <TabBarItem><View [style]="{margin: 2}"></View></TabBarItem>
    </TabBar>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        expect(mock.commandLogs.toString()).toEqual(
          'CREATE+2+test-cmp+{},CREATE+3+native-tabbar+{"flex":1},CREATE+4+native-tabbaritem+{"onPress":true,"selected":true,"position":"absolute","top":0,"right":0,"bottom":0,"left":0},' +
          'CREATE+5+native-tabbaritem+{"onPress":true,"position":"absolute","top":0,"right":0,"bottom":0,"left":0},CREATE+6+native-view+{"margin":1},' +
          'ATTACH+1+2+0,ATTACH+2+3+0,ATTACH+3+4+0,ATTACH+3+5+1,ATTACH+4+6+0');
      });
  }));

  it('should fire select event and switch tab', injectAsync([TestComponentBuilder, ReactNativeRootRenderer], (tcb: TestComponentBuilder, _rootRenderer: ReactNativeRootRenderer) => {
    var rootRenderer = _rootRenderer;
    return tcb.overrideTemplate(TestComponent, `
    <TabBar>
      <TabBarItem [selected]="s == 1" (select)="s = 1"><View [style]="{margin: 1}"></View></TabBarItem>
      <TabBarItem [selected]="s == 2" (select)="s = 2"><View [style]="{margin: 2}"></View></TabBarItem>
    </TabBar>`)
      .createAsync(TestComponent).then((fixture: ComponentFixture) => {
        fixture.detectChanges();
        rootRenderer.executeCommands();
        mock.clearLogs();

        var target = fixture.elementRef.nativeElement.children[1].children[0].children[3].children[0];
        fireFunctionalEvent('topPress', target, {});
        fixture.detectChanges();

        return new Promise((resolve: any) => {
          setTimeout(() => {
            fixture.detectChanges();
            rootRenderer.executeCommands();
            expect(fixture.debugElement.componentInstance.s).toEqual(2);
            expect(mock.commandLogs.toString()).toEqual(
              'CREATE+7+native-view+{"margin":2},UPDATE+4+native-tabbaritem+{"selected":false},UPDATE+5+native-tabbaritem+{"selected":true},ATTACH+5+7+0');
            resolve();
          }, 150);
        });

      });
  }));

});

@Component({
  selector: 'test-cmp',
  template: `to be overriden`,
  directives: [TabBar, TabBarItem, View]
})
class TestComponent {
  @ViewChild(TabBar) tabBar: TabBar
  s: number = 1;
}