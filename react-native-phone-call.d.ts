declare module "react-native-phone-call" {
  const call: (args: { number: string; prompt: boolean }) => Promise<void>;
  export default call;
}
