-- NGO Empowerment Programs and Beneficiaries Schema

CREATE TABLE IF NOT EXISTS empowerment_programs (
    id SERIAL PRIMARY KEY,
    ngo_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    summary TEXT,
    description TEXT,
    learning_objectives TEXT,
    skills_covered TEXT,
    cover_image_url TEXT,
    delivery_mode VARCHAR(50) DEFAULT 'Online', -- Online, Offline, Hybrid
    venue_details TEXT,
    online_access_details TEXT,
    start_at TIMESTAMPTZ,
    end_at TIMESTAMPTZ,
    registration_opens_at TIMESTAMPTZ,
    registration_deadline TIMESTAMPTZ,
    capacity INT,
    approval_mode VARCHAR(50) DEFAULT 'Automatic', -- Automatic, Manual
    waitlist_enabled BOOLEAN DEFAULT false,
    visibility VARCHAR(50) DEFAULT 'All Eligible Sellers', -- All Eligible Sellers, Invite Only, Public
    eligibility_rules JSONB,
    status VARCHAR(50) DEFAULT 'Draft', -- Draft, Published, Cancelled, Completed, Archived
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS program_registrations (
    id SERIAL PRIMARY KEY,
    program_id INT NOT NULL REFERENCES empowerment_programs(id) ON DELETE CASCADE,
    seller_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    application_answers JSONB,
    status VARCHAR(50) DEFAULT 'Applied', -- Applied, Approved, Waitlisted, Rejected, Withdrawn, Completed
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by INT REFERENCES users(id) ON DELETE SET NULL,
    attendance_status VARCHAR(50),
    completion_status VARCHAR(50),
    withdrawn_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(program_id, seller_id)
);

CREATE TABLE IF NOT EXISTS ngo_beneficiaries (
    id SERIAL PRIMARY KEY,
    ngo_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    linked_seller_id INT REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    contact_information JSONB,
    location VARCHAR(255),
    business_category VARCHAR(255),
    skills_interests TEXT,
    consent_status BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
