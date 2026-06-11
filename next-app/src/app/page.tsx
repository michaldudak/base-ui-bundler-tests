'use client';
import { BaseUiFixture } from './BaseUiFixture';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <BaseUiFixture />
    </div>
  );
}
