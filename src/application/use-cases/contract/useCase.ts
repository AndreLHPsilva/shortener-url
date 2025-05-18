export abstract class UseCase<TInput, TOutput> {
  abstract execute(data: TInput): Promise<TOutput>;
}
