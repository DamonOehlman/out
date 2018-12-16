declare namespace out {
  interface Writer {
    write(text: string, extra?: any);
  }

  interface OutApi {
    (text: string, ...values: any);
    error(text: string, ...values: any);
    to(writers: Writer[] | null);
  }
}

declare var out: out.OutApi;
export = out;
