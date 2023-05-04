import { Firestore } from '@google-cloud/firestore';
import type { CTRLHabitsServiceInterface } from '$lib/server/ctrlhabits';
import { CTRLHabitsServiceType } from '$lib/ctrlhabits';
import { FirestoreCTRLHabitsService } from '$lib/server/ctrlhabits/firestore_ctrlhabits_service';
import { FileSystemCTRLHabitsService } from '$lib/server/ctrlhabits/file_system_ctrlhabits_service';
import {
	FIRESTORE_CLIENT_EMAIL,
	FIRESTORE_PRIVATE_KEY,
	FIRESTORE_PROJECT_ID,
	CTRLHABITS_SERVICE_DATA_PATH
} from '$lib/server/env';

/**
 * makeUserService returns the relevant user service.
 */
export function makeCTRLHabitsService(
	ctrlhabitsServiceType: CTRLHabitsServiceType
): CTRLHabitsServiceInterface {
	switch (ctrlhabitsServiceType) {
		// Note: The following switch statement cases change according to enum UserServiceType.
		case CTRLHabitsServiceType.LOCAL: {
			return new FileSystemCTRLHabitsService(CTRLHABITS_SERVICE_DATA_PATH);
		}

		case CTRLHabitsServiceType.FIRESTORE: {
			const firestoreClient = new Firestore({
				projectId: FIRESTORE_PROJECT_ID,
				credentials: {
					client_email: FIRESTORE_CLIENT_EMAIL,
					private_key: FIRESTORE_PRIVATE_KEY
				}
			});
			return new FirestoreCTRLHabitsService(firestoreClient, 'users', 'habits');
		}

		default: {
			throw new Error(`Unknown user service: ${ctrlhabitsServiceType}`);
		}
	}
}