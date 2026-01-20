export type userProps = {
  id: string;
  name: string;
  profile: "pai/responsável" | "equipe escolar" | "criança";
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export class User {
    private constructor(private props: userProps) {
    }
    public static create(props: userProps) {
        return new User(props);
    }
}

