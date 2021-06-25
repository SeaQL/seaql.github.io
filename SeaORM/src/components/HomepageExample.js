import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import React from 'react';
import clsx from 'clsx';
import styles from './HomepageCompare.module.css';

export default function HomepageCompare() {
  return (
    <section className={clsx('home-section', 'home-section-alt', styles.features)}>
      <div className="container">
        <div className="row">
        <div className={clsx('col col--12')}>
            <div className="text--center padding-horiz--md">
              <h2>Example</h2>
              <Tabs
                defaultValue="js"
                values={[
                  { label: 'JavaScript', value: 'js', },
                  { label: 'Python', value: 'py', },
                  { label: 'Java', value: 'java', },
                ]
              }>
              <TabItem value="js">
              {`js
              function helloWorld() {
                console.log('Hello, world!');
              }
              `}
              </TabItem>
              <TabItem value="py">
              {`py
              def hello_world():
                print 'Hello, world!'
              `}
              </TabItem>
              <TabItem value="java">
              {`java
              class HelloWorld {
                public static void main(String args[]) {
                  System.out.println("Hello, World");
                }
              }
              `}
              </TabItem>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
