import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import { Button, Portal, TextInput } from "react-native-paper";

interface ReviewDialogProps {
	visible: boolean;
	onDismiss: () => void;
	onSubmit: (content: string, rating: number) => Promise<void>;
	initialContent?: string;
	initialRating?: number;
	isEdit?: boolean;
}

export function ReviewDialog({
	visible,
	onDismiss,
	onSubmit,
	initialContent = "",
	initialRating = 5,
	isEdit = false,
}: ReviewDialogProps) {
	const colorScheme = useColorScheme();
	const colors = Colors[colorScheme ?? "light"];
	const [content, setContent] = useState(initialContent);
	const [rating, setRating] = useState(initialRating);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		if (!content.trim() || rating < 1 || rating > 10) return;

		setIsSubmitting(true);
		try {
			await onSubmit(content, rating);
			setContent("");
			setRating(5);
			onDismiss();
		} catch (error) {
			console.error("Error submitting review:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		setContent(initialContent);
		setRating(initialRating);
		onDismiss();
	};

	return (
		<Portal>
			<Modal
				visible={visible}
				onRequestClose={handleCancel}
				animationType="slide"
				transparent
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.container}
				>
					<ThemedView
						style={[
							styles.dialog,
							{ backgroundColor: colors.background },
						]}
					>
						<ThemedText style={styles.title}>
							{isEdit ? "Edit Review" : "Write Review"}
						</ThemedText>

						<ScrollView style={styles.content}>
							<View style={styles.ratingSection}>
								<ThemedText style={styles.label}>
									Rating (1-10)
								</ThemedText>
								<View style={styles.ratingButtons}>
									{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
										(value) => (
											<Button
												key={value}
												mode={
													rating === value
														? "contained"
														: "outlined"
												}
												onPress={() => setRating(value)}
												style={styles.ratingButton}
												compact
											>
												{value}
											</Button>
										),
									)}
								</View>
							</View>

							<View style={styles.textSection}>
								<ThemedText style={styles.label}>
									Your Review
								</ThemedText>
								<TextInput
									mode="outlined"
									value={content}
									onChangeText={setContent}
									multiline
									numberOfLines={8}
									placeholder="Share your thoughts about this..."
									style={[
										styles.textInput,
										{ backgroundColor: colors.card },
									]}
									outlineColor={colors.border}
									activeOutlineColor={colors.primary}
									textColor={colors.text}
									placeholderTextColor={colors.text + "80"}
								/>
							</View>
						</ScrollView>

						<View style={styles.actions}>
							<Button
								mode="outlined"
								onPress={handleCancel}
								style={styles.button}
								disabled={isSubmitting}
							>
								Cancel
							</Button>
							<Button
								mode="contained"
								onPress={handleSubmit}
								style={styles.button}
								loading={isSubmitting}
								disabled={!content.trim() || isSubmitting}
							>
								{isEdit ? "Update" : "Submit"}
							</Button>
						</View>
					</ThemedView>
				</KeyboardAvoidingView>
			</Modal>
		</Portal>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-end",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	dialog: {
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 20,
		maxHeight: "90%",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
	},
	content: {
		marginBottom: 20,
	},
	ratingSection: {
		marginBottom: 24,
	},
	label: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 12,
	},
	ratingButtons: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	ratingButton: {
		minWidth: 50,
	},
	textSection: {
		marginBottom: 16,
	},
	textInput: {
		minHeight: 150,
		textAlignVertical: "top",
	},
	actions: {
		flexDirection: "row",
		gap: 12,
		justifyContent: "flex-end",
	},
	button: {
		minWidth: 100,
	},
});
