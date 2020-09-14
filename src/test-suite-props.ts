type SuiteTest = { suite?: string; test?: string };
export class TestSuiteProps {
  private prop: SuiteTest = {};

  set testProp(prop: string | undefined) {
    this.prop.test = prop;
  }

  get suiteProp() {
    return this.prop.suite;
  }

  set suiteProp(prop: string | undefined) {
    this.prop.suite = prop;
  }

  apply(setProp: (prop: string) => void) {
    const prop_ = this.prop.test ?? this.prop.suite;

    if (prop_) {
      setProp(prop_);
      this.prop.test = undefined;
    }
  }
}
