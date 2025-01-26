export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const validatePassword = (password) => {
    return password && password.length >= 1;
};

export const getInitials = (name) => {
    if (!name) return '';
    const words = name.split(' ');
    let initials = '';
    for(let i=0; i<Math.min(words.length, 2); i++) {
        initials += words[i][0];
    }
    return initials.toUpperCase();
};

export const checkPasswordStrength = (password) => {
    const requirements = [
        {
            test: password.length >= 8,
            message: "Password should be at least 8 characters long"
        },
        {
            test: /[A-Z]/.test(password),
            message: "Include at least one uppercase letter"
        },
        {
            test: /[0-9]/.test(password),
            message: "Include at least one number"
        },
        {
            test: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            message: "Include at least one special character"
        }
    ];

    const failedRequirements = requirements.filter(req => !req.test);
    const passedCount = requirements.length - failedRequirements.length;

    let strength = "Weak";
    let color = "text-red-500";

    if (passedCount === requirements.length) {
        strength = "Strong";
        color = "text-green-500";
    } else if (passedCount >= 2) {
        strength = "Medium";
        color = "text-yellow-500";
    }

    return {
        strength,
        color,
        isValid: failedRequirements.length === 0,
        feedback: failedRequirements.map(req => req.message)
    };
};
