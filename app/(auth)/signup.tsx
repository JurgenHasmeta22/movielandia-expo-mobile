import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuthStore } from "@/store/auth.store";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import { Button, HelperText, TextInput, Title } from "react-native-paper";

export default function SignUpScreen() {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const signUp = useAuthStore((state) => state.signUp);

	const handleSignUp = async () => {
		try {
			setError("");
			setLoading(true);

			if (!email || !username || !password || !confirmPassword) {
				setError("Please fill in all required fields");
				return;
			}

			if (password !== confirmPassword) {
				setError("Passwords do not match");
				return;
			}

			if (password.length < 6) {
				setError("Password must be at least 6 characters");
				return;
			}

			await signUp(email, password, username, name);
			setSuccess(true);

			setTimeout(() => {
				router.replace("/signin");
			}, 2000);
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to create account";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<ThemedView style={styles.container}>
				<View style={styles.successContainer}>
					<Title style={styles.title}>Account Created!</Title>
					<ThemedText style={styles.subtitle}>
						Please check your email to verify your account.
					</ThemedText>
					<ThemedText style={styles.subtitle}>
						Redirecting to sign in...
					</ThemedText>
				</View>
			</ThemedView>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardView}
			>
				<ScrollView contentContainerStyle={styles.scrollContent}>
					<View style={styles.content}>
						<Title style={styles.title}>Create Account</Title>
						<ThemedText style={styles.subtitle}>
							Sign up to get started
						</ThemedText>

						<View style={styles.form}>
							<TextInput
								label="Email *"
								value={email}
								onChangeText={setEmail}
								keyboardType="email-address"
								autoCapitalize="none"
								mode="outlined"
								style={styles.input}
								error={!!error}
								disabled={loading}
							/>

							<TextInput
								label="Username *"
								value={username}
								onChangeText={setUsername}
								autoCapitalize="none"
								mode="outlined"
								style={styles.input}
								error={!!error}
								disabled={loading}
							/>

							<TextInput
								label="Name (Optional)"
								value={name}
								onChangeText={setName}
								mode="outlined"
								style={styles.input}
								disabled={loading}
							/>

							<TextInput
								label="Password *"
								value={password}
								onChangeText={setPassword}
								secureTextEntry={!showPassword}
								mode="outlined"
								style={styles.input}
								error={!!error}
								disabled={loading}
								right={
									<TextInput.Icon
										icon={showPassword ? "eye-off" : "eye"}
										onPress={() =>
											setShowPassword(!showPassword)
										}
									/>
								}
							/>

							<TextInput
								label="Confirm Password *"
								value={confirmPassword}
								onChangeText={setConfirmPassword}
								secureTextEntry={!showPassword}
								mode="outlined"
								style={styles.input}
								error={!!error}
								disabled={loading}
							/>

							{error ? (
								<HelperText type="error" visible={!!error}>
									{error}
								</HelperText>
							) : null}

							<Button
								mode="contained"
								onPress={handleSignUp}
								loading={loading}
								disabled={loading}
								style={styles.button}
							>
								Sign Up
							</Button>

							<View style={styles.signinContainer}>
								<ThemedText>
									Already have an account?{" "}
								</ThemedText>
								<Link href="/signin" asChild>
									<Button
										mode="text"
										disabled={loading}
										compact
									>
										Sign In
									</Button>
								</Link>
							</View>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	keyboardView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
	content: {
		flex: 1,
		padding: 24,
		justifyContent: "center",
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		marginBottom: 8,
		textAlign: "center",
	},
	subtitle: {
		fontSize: 16,
		marginBottom: 32,
		textAlign: "center",
		opacity: 0.7,
	},
	form: {
		gap: 16,
	},
	input: {
		marginBottom: 8,
	},
	button: {
		marginTop: 8,
		paddingVertical: 6,
	},
	signinContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 16,
	},
	successContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
	},
});
