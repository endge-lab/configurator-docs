# Types: TimelineRootData

`TimelineRootData<G, T>` описывает полный snapshot данных.

```ts
interface TimelineRootData<G, T> {
  groups?: G[]
  tasks?: T[]
  backgrounds?: T[]
}
```
