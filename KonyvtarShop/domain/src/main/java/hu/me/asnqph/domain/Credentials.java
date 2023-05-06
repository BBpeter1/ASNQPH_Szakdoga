package hu.me.asnqph.domain;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class Credentials {

    private String loginName;
    private String password;

    public String getLoginName() {
        return loginName;
    }

    public String getPassword() {
        return password;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}

