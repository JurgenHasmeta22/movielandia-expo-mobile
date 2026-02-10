import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuthStore } from "@/store/auth.store";
import { Link, router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, HelperText, TextInput, Title } from "react-native-paper";

export default function SignInScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const signIn = useAuthStore((state) => state.signIn);

	const handleSignIn = async () => {
		try {
			setError("");
			setLoading(true);

			if (!email || !password) {
				setError("Please fill in all fields");
				return;
			}

			await signIn(email, password);
			router.replace("/(tabs)");
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : "Invalid credentials";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ThemedView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardView}
			>
				<View style={styles.content}>
					<Title style={styles.title}>Welcome Back</Title>
					<ThemedText style={styles.subtitle}>
						Sign in to your account
					</ThemedText>

					<View style={styles.form}>
						<TextInput
							label="Email"
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
							label="Password"
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

						{error ? (
							<HelperText type="error" visible={!!error}>
								{error}
							</HelperText>
						) : null}

						<Button
							mode="contained"
							onPress={handleSignIn}
							loading={loading}
							disabled={loading}
							style={styles.button}
						>
							Sign In
						</Button>

						<Link href="/forgot-password" asChild>
							<Button mode="text" disabled={loading}>
								Forgot Password?
							</Button>
						</Link>

						<View style={styles.signupContainer}>
							<ThemedText>{"Don't have an account? "}</ThemedText>
							<Link href="/signup" asChild>
								<Button mode="text" disabled={loading} compact>
									Sign Up
								</Button>
							</Link>
						</View>
					</View>
				</View>
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
	signupContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 16,
	},
});
