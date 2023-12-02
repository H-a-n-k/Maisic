
export default interface IClonable<T> {
    clone(): T
    copy(item: T): void
}