export const ConstructorMetadataEmitter = (): ClassDecorator => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    return <TFunction extends Function>(target: TFunction): TFunction => {
        return target;
    };
};
